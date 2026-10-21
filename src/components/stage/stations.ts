// The site as a system map: each page section is a "station" (a cluster in
// the 3D world). Shared by the DOM (Station wrapper, rail, header) and the
// 3D stage. No three.js import.

export type StationShape = "fan" | "ring" | "lattice" | "stream" | "pods" | "radar" | "chain" | "tree" | "hub";

export const STATIONS = [
  { id: "top", node: "ingress", title: "Home", shape: "fan" },
  { id: "about", node: "gateway", title: "About", shape: "ring" },
  { id: "skills", node: "services", title: "Skills", shape: "lattice" },
  { id: "experience", node: "logs", title: "Experience", shape: "stream" },
  { id: "projects", node: "deploy", title: "Projects", shape: "pods" },
  { id: "recommendations", node: "monitor", title: "Recommendations", shape: "radar" },
  { id: "upcoming-projects", node: "backlog", title: "Upcoming", shape: "chain" },
  { id: "faq", node: "docs", title: "FAQ", shape: "tree" },
  { id: "contact", node: "inbox", title: "Contact", shape: "hub" },
] as const satisfies readonly { id: string; node: string; title: string; shape: StationShape }[];

export type StationIndex = number;

export function stationLabel(i: StationIndex) {
  return `${String(i).padStart(2, "0")} · ${STATIONS[i].node}`;
}
