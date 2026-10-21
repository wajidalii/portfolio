import { Color, PerspectiveCamera, Vector3 } from "three";
import type { SystemColors } from "./system-graph";

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Scene colours from the live CSS tokens, so 3D follows mode + palette. */
export function themeColors(): SystemColors {
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const second = token("--uv-led") || token(light ? "--accent2-fg" : "--accent2");
  return {
    a: new Color(token(light ? "--accent-fg" : "--accent") || "#a9c7e8"),
    b: new Color(second || "#cfd8e2"),
    line: new Color(token(light ? "--accent2-fg" : "--muted") || "#8b96a2"),
    additive: !light,
  };
}

/** Pulls the camera back until a sphere of `radius` fits the frame. */
export function frame(camera: PerspectiveCamera, radius: number, fill = 1) {
  const vFov = (camera.fov * Math.PI) / 180;
  const fitH = radius / Math.tan(vFov / 2);
  const fitW = radius / (Math.tan(vFov / 2) * camera.aspect);
  camera.position.set(0, 0, Math.max(fitH, fitW) / fill);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

/** Focal length in device pixels for a viewport `heightPx` tall. */
export function focalPx(camera: PerspectiveCamera, heightPx: number) {
  return heightPx / (2 * Math.tan((camera.fov * Math.PI) / 360));
}

export function radiusOf(points: Vector3[]) {
  return Math.max(...points.map((p) => p.length()));
}

/** Calls `cb` on mode or palette change. */
export function watchTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
  return () => mo.disconnect();
}
