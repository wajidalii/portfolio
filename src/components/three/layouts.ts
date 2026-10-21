// System-graph layouts for the 3D scenes. Plain data, no three.js import, so
// content files can reference preset names without pulling WebGL code in.
// Positions are world units; `tier` drives colour (accent → secondary) and
// the default request direction (low tier → high tier).

export type Vec3 = [number, number, number];
export type SystemNode = { p: Vec3; tier: number; size?: number };
export type SystemLayout = {
  nodes: SystemNode[];
  /** Directed edges [from, to]; requests flow from → to, responses back. */
  edges: [number, number][];
  /** Packets spawned per second at rest. */
  rate: number;
  /** Auto-rotation around Y, radians per second. */
  spin?: number;
  /** Packet pool size (default 160). */
  packets?: number;
};

export type ScenePreset = "fanout" | "cluster";

/** ReelBridge: creator → API → job queue → workers → platforms. */
function fanout(): SystemLayout {
  const nodes: SystemNode[] = [
    { p: [-4.6, 0, 0], tier: 0, size: 0.9 },
    { p: [-2.4, 0, 0.4], tier: 1, size: 1.1 },
    { p: [-0.2, 0, -0.3], tier: 2, size: 1.5 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
  ];
  for (let i = 0; i < 3; i++) {
    const y = (i - 1) * 1.9;
    const w = nodes.length;
    nodes.push({ p: [2.1, y, (i - 1) * 0.8], tier: 3, size: 0.9 });
    nodes.push({ p: [4.5, y * 1.15, (1 - i) * 0.6], tier: 4, size: 1.2 });
    edges.push([2, w], [w, w + 1]);
  }
  return { nodes, edges, rate: 5 };
}

/** HRMS: modules in a ring around a shared core, with cross-module calls. */
function cluster(): SystemLayout {
  const nodes: SystemNode[] = [{ p: [0, 0, 0], tier: 0, size: 1.8 }];
  const edges: [number, number][] = [];
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const lift = i % 2 ? 0.9 : -0.9;
    nodes.push({ p: [Math.cos(a) * 3.4, lift, Math.sin(a) * 3.4], tier: 1 + (i % 2), size: 0.95 });
    edges.push([0, i + 1], [i + 1, ((i + 1) % n) + 1]);
  }
  return { nodes, edges, rate: 6, spin: 0.22 };
}

export const LAYOUTS: Record<ScenePreset, () => SystemLayout> = { fanout, cluster };
