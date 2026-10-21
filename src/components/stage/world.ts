import type { SystemLayout, SystemNode, Vec3 } from "@/components/three/layouts";
import type { StationShape } from "./stations";

type Local = { nodes: { p: Vec3; size?: number }[]; edges: [number, number][] };

/** Cluster shapes, in local coordinates around the station centre. Index 0 is the hub. */
const SHAPES: Record<StationShape, () => Local> = {
  // Clients fanning into an entry point.
  fan: () => ({
    nodes: [{ p: [1.6, 0, 0], size: 1.7 }, ...[-2, -1, 0, 1, 2].map((k) => ({ p: [-2.6, k * 1.25, Math.abs(k) * -0.6] as Vec3, size: 0.7 }))],
    edges: [1, 2, 3, 4, 5].map((i) => [i, 0] as [number, number]),
  }),
  // A load balancer with a ring of instances.
  ring: () => {
    const nodes: Local["nodes"] = [{ p: [0, 0, 0], size: 1.6 }];
    const edges: Local["edges"] = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      nodes.push({ p: [Math.cos(a) * 3, Math.sin(a) * 3, Math.sin(a * 2) * 0.8], size: 0.8 });
      edges.push([0, i + 1], [i + 1, ((i + 1) % 7) + 1]);
    }
    return { nodes, edges };
  },
  // A lattice of services behind a mesh hub.
  lattice: () => {
    const nodes: Local["nodes"] = [{ p: [0, 0, -2.2], size: 1.5 }];
    const edges: Local["edges"] = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        const i = nodes.length;
        nodes.push({ p: [(c - 1) * 2.2, (1 - r) * 2.2, ((r + c) % 2) * 0.9], size: 0.95 });
        edges.push([0, i]);
        if (c > 0) edges.push([i - 1, i]);
        if (r > 0) edges.push([i - 3, i]);
      }
    return { nodes, edges };
  },
  // An event stream: a line of partitions.
  stream: () => ({
    nodes: Array.from({ length: 7 }, (_, i) => ({ p: [(i - 3) * 1.5, Math.sin(i * 0.9) * 0.9, Math.cos(i * 0.7) * 0.8] as Vec3, size: i === 0 ? 1.4 : 0.85 })),
    edges: Array.from({ length: 6 }, (_, i) => [i, i + 1] as [number, number]),
  }),
  // Three deployment pods behind a release hub.
  pods: () => {
    const nodes: Local["nodes"] = [{ p: [0, 0, -1.6], size: 1.5 }];
    const edges: Local["edges"] = [];
    ([
      [-3, -0.6, 0],
      [0, 1.8, 0.6],
      [3, -0.4, 0],
    ] as Vec3[]).forEach((c) => {
      const pod = nodes.length;
      nodes.push({ p: c, size: 1.1 });
      edges.push([0, pod]);
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        nodes.push({ p: [c[0] + Math.cos(a) * 1.1, c[1] + Math.sin(a) * 1.1, c[2] + 0.5], size: 0.55 });
        edges.push([pod, nodes.length - 1]);
      }
    });
    return { nodes, edges };
  },
  // Health checks on a flat radar disc.
  radar: () => {
    const nodes: Local["nodes"] = [{ p: [0, 0, 0], size: 1.5 }];
    const edges: Local["edges"] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = i % 2 ? 3.2 : 2.1;
      nodes.push({ p: [Math.cos(a) * r, Math.sin(a) * r * 0.35, Math.sin(a) * r], size: 0.65 });
      edges.push([0, i + 1]);
    }
    return { nodes, edges };
  },
  // A short work queue.
  chain: () => ({
    nodes: [0, 1, 2, 3].map((i) => ({ p: [(i - 1.5) * 1.8, i % 2 ? 0.7 : -0.7, 0] as Vec3, size: i === 0 ? 1.3 : 0.8 })),
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  }),
  // Docs: a small tree.
  tree: () => ({
    nodes: [
      { p: [0, 2.2, 0], size: 1.4 },
      { p: [-1.8, 0.4, 0.4], size: 0.9 },
      { p: [1.8, 0.4, -0.4], size: 0.9 },
      { p: [-2.7, -1.6, 0], size: 0.6 },
      { p: [-0.9, -1.6, 0.6], size: 0.6 },
      { p: [0.9, -1.6, -0.6], size: 0.6 },
      { p: [2.7, -1.6, 0], size: 0.6 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
    ],
  }),
  // The inbox: everything ends here.
  hub: () => {
    const nodes: Local["nodes"] = [{ p: [0, 0, 0], size: 2.3 }];
    const edges: Local["edges"] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      nodes.push({ p: [Math.cos(a) * 2.6, Math.sin(a) * 2.6, -1], size: 0.6 });
      edges.push([i + 1, 0]);
    }
    return { nodes, edges };
  },
};

export type WorldStation = { center: Vec3; hub: number; first: number; count: number };

/** Station i sits on a gentle path receding into the screen. */
export function stationCenter(i: number): Vec3 {
  return [Math.sin(i * 1.3) * 7, Math.sin(i * 0.8) * 2.2, -i * 18];
}

/**
 * Lays every station's cluster out along the path and links consecutive
 * hubs into a backbone, so traffic visibly flows from ingress to inbox.
 */
export function buildWorld(shapes: readonly StationShape[]): { layout: SystemLayout; stations: WorldStation[] } {
  const nodes: SystemNode[] = [];
  const edges: [number, number][] = [];
  const stations: WorldStation[] = [];

  shapes.forEach((shape, si) => {
    const c = stationCenter(si);
    const local = SHAPES[shape]();
    const first = nodes.length;
    local.nodes.forEach((n) =>
      nodes.push({ p: [c[0] + n.p[0], c[1] + n.p[1], c[2] + n.p[2]], tier: si, size: n.size }),
    );
    local.edges.forEach(([a, b]) => edges.push([first + a, first + b]));
    stations.push({ center: c, hub: first, first, count: local.nodes.length });
    if (si > 0) {
      const prev = stations[si - 1];
      edges.push([prev.hub, first]);
      edges.push([prev.first + prev.count - 1, first + Math.min(2, local.nodes.length - 1)]);
    }
  });

  return { layout: { nodes, edges, rate: 26, packets: 280 }, stations };
}
