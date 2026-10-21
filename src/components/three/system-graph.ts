import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  OctahedronGeometry,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import type { SystemLayout } from "./layouts";

export type SystemColors = {
  /** Request colour / low tiers. */
  a: Color;
  /** Response colour / high tiers. */
  b: Color;
  line: Color;
  /** Additive glow on dark backgrounds; normal blending on light ones. */
  additive: boolean;
};

// Soft round sprite: a halo plus a bright core. Size is a world-space
// diameter; uScale is the camera's focal length in device pixels.
const POINT_VS = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;
uniform float uScale;
uniform float uFog;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // Capped so a node drifting close to the camera can't balloon.
  gl_PointSize = min(aSize * uScale / -mv.z, uScale * 0.06);
  gl_Position = projectionMatrix * mv;
  vColor = aColor;
  // Same falloff as three's FogExp2, applied as fade-out.
  float f = uFog * -mv.z;
  vAlpha = aAlpha * exp(-f * f);
}`;
const POINT_FS = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float halo = pow(1.0 - smoothstep(0.0, 0.5, d), 2.4);
  float core = 1.0 - smoothstep(0.07, 0.13, d);
  float a = (halo * 0.6 + core) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;

function pointCloud(count: number) {
  const geo = new BufferGeometry();
  const attr = (name: string, size: number) => {
    const a = new BufferAttribute(new Float32Array(count * size), size);
    geo.setAttribute(name, a);
    return a;
  };
  const pos = attr("position", 3);
  const col = attr("aColor", 3);
  const size = attr("aSize", 1);
  const alpha = attr("aAlpha", 1);
  const mat = new ShaderMaterial({
    vertexShader: POINT_VS,
    fragmentShader: POINT_FS,
    uniforms: { uScale: { value: 800 }, uFog: { value: 0 } },
    transparent: true,
    depthWrite: false,
  });
  const points = new Points(geo, mat);
  points.frustumCulled = false;
  return { points, mat, pos, col, size, alpha };
}

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * A distributed system drawn as nodes (wireframe octahedra + glow), edges,
 * and packets that travel along edges and hop onward through the graph:
 * requests flow down the tiers in colour `a`, responses come back in `b`.
 */
export function buildSystem(layout: SystemLayout, colors: SystemColors) {
  const group = new Group();
  const { nodes, edges } = layout;
  const n = nodes.length;
  const maxTier = Math.max(1, ...nodes.map((x) => x.tier));
  const positions = nodes.map((x) => new Vector3(...x.p));
  const PACKETS = layout.packets ?? 160;
  /** 0–1 per node: how lit it is (the stage dims stations you're not at). */
  const emphasis = new Float32Array(n).fill(1);

  const outgoing: number[][] = nodes.map(() => []);
  const incoming: number[][] = nodes.map(() => []);
  edges.forEach(([a, b], k) => {
    outgoing[a].push(k);
    incoming[b].push(k);
  });

  // Edges
  const edgePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    edgePos.set(nodes[a].p, k * 6);
    edgePos.set(nodes[b].p, k * 6 + 3);
  });
  const edgeGeo = new BufferGeometry();
  edgeGeo.setAttribute("position", new BufferAttribute(edgePos, 3));
  const edgeMat = new LineBasicMaterial({ transparent: true, opacity: 0.22, depthWrite: false });
  group.add(new LineSegments(edgeGeo, edgeMat));

  // Node shells
  const shellGeo = new OctahedronGeometry(1, 0);
  const shellMat = new MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.6, depthWrite: false });
  const shells = new InstancedMesh(shellGeo, shellMat, n);
  group.add(shells);

  // Node glows and packets
  const glow = pointCloud(n);
  const pkt = pointCloud(PACKETS);
  group.add(glow.points, pkt.points);

  const pulse = new Float32Array(n);
  let hover = -1;
  const pEdge = new Int32Array(PACKETS).fill(-1);
  const pDir = new Int8Array(PACKETS);
  const pT = new Float32Array(PACKETS);
  const pSpeed = new Float32Array(PACKETS);
  let spawnDebt = 0;
  let time = 0;

  const tierColor = (tier: number) => colors.a.clone().lerp(colors.b, tier / maxTier);

  function applyColors() {
    edgeMat.color.copy(colors.line);
    const blending = colors.additive ? AdditiveBlending : NormalBlending;
    for (const m of [glow.mat, pkt.mat]) {
      m.blending = blending;
      m.needsUpdate = true;
    }
    nodes.forEach((node, i) => {
      const c = tierColor(node.tier);
      glow.col.setXYZ(i, c.r, c.g, c.b);
      shells.setColorAt(i, colors.additive ? c.multiplyScalar(0.3 + 0.7 * emphasis[i]) : c);
    });
    if (shells.instanceColor) shells.instanceColor.needsUpdate = true;
    glow.col.needsUpdate = true;
  }
  applyColors();
  nodes.forEach((_, i) => glow.pos.setXYZ(i, ...nodes[i].p));
  glow.pos.needsUpdate = true;

  function launch(edge: number, dir: 1 | -1) {
    const slot = pEdge.indexOf(-1);
    if (slot < 0) return;
    pEdge[slot] = edge;
    pDir[slot] = dir;
    pT[slot] = 0;
    pSpeed[slot] = 0.55 + Math.random() * 0.5;
    const c = dir === 1 ? colors.a : colors.b;
    pkt.col.setXYZ(slot, c.r, c.g, c.b);
    pkt.col.needsUpdate = true;
  }

  /** Fire packets out of a node along every edge it touches. */
  function burst(node: number) {
    pulse[node] = 1;
    for (const k of outgoing[node]) launch(k, 1);
    for (const k of incoming[node]) launch(k, -1);
  }

  const dummy = new Object3D();

  function update(dt: number) {
    // rAF timestamps can trail performance.now(); a negative step would
    // turn the exponential decays below into exponential growth.
    dt = Math.min(Math.max(dt, 0), 0.05);
    time += dt;
    if (layout.spin) group.rotation.y += layout.spin * dt;

    // Spawn: mostly requests entering at tier-0-ish edges, some responses.
    spawnDebt += layout.rate * dt;
    while (spawnDebt >= 1) {
      spawnDebt -= 1;
      const k = Math.floor(Math.random() * edges.length);
      launch(k, Math.random() < 0.72 ? 1 : -1);
    }
    if (hover >= 0 && Math.random() < dt * 6) burst(hover);

    // Move packets; on arrival, flash the node and maybe hop onward.
    for (let i = 0; i < PACKETS; i++) {
      const k = pEdge[i];
      if (k < 0) {
        pkt.alpha.setX(i, 0);
        continue;
      }
      pT[i] += pSpeed[i] * dt;
      const [a, b] = edges[k];
      if (pT[i] >= 1) {
        const at = pDir[i] === 1 ? b : a;
        pulse[at] = Math.min(1, pulse[at] + 0.5);
        const next = pDir[i] === 1 ? outgoing[at] : incoming[at];
        if (next.length && Math.random() < 0.7) {
          pEdge[i] = next[Math.floor(Math.random() * next.length)];
          pT[i] = 0;
        } else {
          pEdge[i] = -1;
          pkt.alpha.setX(i, 0);
          continue;
        }
      }
      const [from, to] = pDir[i] === 1 ? edges[pEdge[i]] : [edges[pEdge[i]][1], edges[pEdge[i]][0]];
      const t = ease(pT[i]);
      const pf = nodes[from].p;
      const pt = nodes[to].p;
      pkt.pos.setXYZ(i, pf[0] + (pt[0] - pf[0]) * t, pf[1] + (pt[1] - pf[1]) * t, pf[2] + (pt[2] - pf[2]) * t);
      const lit = Math.max(emphasis[from], emphasis[to]);
      pkt.alpha.setX(i, (Math.sin(Math.PI * Math.min(1, pT[i] * 1.15)) * 0.9 + 0.1) * (0.2 + 0.8 * lit));
      pkt.size.setX(i, 0.55);
    }
    pkt.pos.needsUpdate = pkt.alpha.needsUpdate = pkt.size.needsUpdate = true;

    // Nodes: breathe, flash on arrivals, swell under the pointer.
    for (let i = 0; i < n; i++) {
      pulse[i] *= Math.exp(-dt * 3.2);
      const base = (nodes[i].size ?? 1) * 0.2;
      const lift = pulse[i] * 0.7 + (i === hover ? 0.6 : 0);
      const e = emphasis[i];
      glow.size.setX(i, base * 6 * (1 + lift) * (0.7 + 0.3 * e));
      glow.alpha.setX(i, (0.55 + 0.45 * Math.min(1, lift) + Math.sin(time * 1.6 + i) * 0.06) * (0.18 + 0.82 * e));
      dummy.position.copy(positions[i]);
      dummy.rotation.set(time * 0.35 + i, time * 0.5 + i * 0.7, 0);
      dummy.scale.setScalar(base * (1 + lift * 0.5));
      dummy.updateMatrix();
      shells.setMatrixAt(i, dummy.matrix);
    }
    glow.size.needsUpdate = glow.alpha.needsUpdate = true;
    shells.instanceMatrix.needsUpdate = true;
  }

  return {
    group,
    positions,
    update,
    burst,
    setHover(i: number) {
      hover = i;
    },
    /** Focal length in device pixels, so point sizes stay in world units. */
    setScale(px: number) {
      glow.mat.uniforms.uScale.value = px;
      pkt.mat.uniforms.uScale.value = px;
    },
    setColors(c: SystemColors) {
      colors = c;
      applyColors();
    },
    /** Per-node 0–1 emphasis; dims shells, glows and passing packets. */
    setEmphasis(e: ArrayLike<number>) {
      emphasis.set(e);
      applyColors();
    },
    /** Exponential depth fade for sprites (pair with scene FogExp2). */
    setFog(density: number) {
      glow.mat.uniforms.uFog.value = density;
      pkt.mat.uniforms.uFog.value = density;
    },
    dispose() {
      for (const o of [edgeGeo, shellGeo, glow.points.geometry, pkt.points.geometry]) o.dispose();
      for (const m of [edgeMat, shellMat, glow.mat, pkt.mat]) m.dispose();
      shells.dispose();
    },
  };
}

export type System = ReturnType<typeof buildSystem>;
