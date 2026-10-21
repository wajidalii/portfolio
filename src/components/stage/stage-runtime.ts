import { Color, FogExp2, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { buildSystem } from "@/components/three/system-graph";
import { focalPx, themeColors, watchTheme } from "@/components/three/scene-utils";
import { STATIONS } from "./stations";
import { buildWorld } from "./world";

const FOG = 0.03;
const WIDE = 960;

type Pose = { pos: Vector3; look: Vector3 };
type Hold = { start: number; end: number };

/**
 * The fixed 3D stage behind the whole page. Scroll position maps to a
 * continuous station index; the camera eases between station poses and
 * holds while a section is being read. The current station is lit, the
 * rest recede into fog, and its hub pings on arrival.
 */
export function mountStage(canvas: HTMLCanvasElement, { animate, onReady }: { animate: boolean; onReady: () => void }) {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new WebGLRenderer({ canvas, antialias: !coarse, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(coarse ? 1 : 1.5, window.devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);

  const { layout, stations } = buildWorld(STATIONS.map((s) => s.shape));
  const system = buildSystem(layout, themeColors());
  system.setFog(FOG);
  const scene = new Scene();
  scene.add(system.group);
  const fogColor = new Color();
  const readFog = () => fogColor.set(getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0e1114");
  readFog();
  scene.fog = new FogExp2(fogColor, FOG);

  const camera = new PerspectiveCamera(40, 1, 0.1, 400);

  // --- Layout: viewport, station poses, section hold ranges -------------
  let vw = 0;
  let vh = 0;
  let poses: Pose[] = [];
  let holds: Hold[] = [];

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    system.setScale(focalPx(camera, vh * renderer.getPixelRatio()));

    const wide = vw >= WIDE;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
    poses = stations.map((st, i) => {
      const c = new Vector3(...st.center);
      const side = els[i]?.dataset.side ?? "center";
      const dist = i === 0 ? 17 : 13.5;
      if (!wide) return { pos: c.clone().add(new Vector3(0, 1.2, dist + 3)), look: c.clone().add(new Vector3(0, -2.6, 0)) };
      // Content docked left → frame the cluster on the right, and vice versa.
      const s = side === "left" ? -1 : side === "right" ? 1 : 0;
      return {
        pos: c.clone().add(new Vector3(s * 2.4, 2, dist)),
        look: c.clone().add(new Vector3(s * 3.8, 0, i === 0 ? -3 : 0)),
      };
    });
    holds = stations.map((_, i) => {
      const el = els[i];
      if (!el) return { start: Infinity, end: Infinity };
      const top = el.getBoundingClientRect().top + window.scrollY;
      const h = el.offsetHeight;
      const pad = Math.min(vh * 0.35, h * 0.35);
      return { start: top + pad, end: top + h - pad };
    });
  }

  /** Continuous station index for the current scroll position. */
  function stationAt(): number {
    const c = window.scrollY + vh / 2;
    if (!holds.length || c <= holds[0].start) return 0;
    for (let i = 0; i < holds.length; i++) {
      if (c <= holds[i].end) return i;
      const next = holds[i + 1];
      if (!next || !isFinite(next.start)) return i;
      if (c < next.start) return i + (c - holds[i].end) / Math.max(1, next.start - holds[i].end);
    }
    return holds.length - 1;
  }

  const smooth = (t: number) => t * t * (3 - 2 * t);
  const target = { pos: new Vector3(), look: new Vector3() };
  const look = new Vector3();
  let current = -1;
  const emphasis = new Float32Array(layout.nodes.length);

  function aim(s: number) {
    const i = Math.min(poses.length - 1, Math.floor(s));
    const j = Math.min(poses.length - 1, i + 1);
    const t = smooth(s - i);
    target.pos.lerpVectors(poses[i].pos, poses[j].pos, t);
    target.look.lerpVectors(poses[i].look, poses[j].look, t);

    // Light the station(s) we're at; dim the rest.
    stations.forEach((st, k) => {
      const w = Math.max(0, 1 - Math.abs(s - k) * 1.25);
      emphasis.fill(0.15 + 0.85 * w, st.first, st.first + st.count);
    });
    system.setEmphasis(emphasis);

    const nearest = Math.round(s);
    if (nearest !== current) {
      if (current >= 0 && animate) system.burst(stations[nearest].hub);
      current = nearest;
    }
  }

  // --- Pointer parallax --------------------------------------------------
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => {
    par.tx = (e.clientX / vw - 0.5) * 1.6;
    par.ty = (e.clientY / vh - 0.5) * -1;
  };

  // --- Render ------------------------------------------------------------
  const base = new Vector3();
  function place(follow: number) {
    base.lerp(target.pos, follow);
    look.lerp(target.look, follow);
    camera.position.set(base.x + par.x, base.y + par.y, base.z);
    camera.lookAt(look);
  }

  measure();
  aim(stationAt());
  base.copy(target.pos);
  look.copy(target.look);
  for (let k = 0; k < 90; k++) system.update(1 / 30);

  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.max(0, now - last) / 1000;
    last = now;
    aim(stationAt());
    par.x += (par.tx - par.x) * 0.04;
    par.y += (par.ty - par.y) * 0.04;
    place(1 - Math.exp(-dt * 3.2));
    system.update(dt);
    renderer.render(scene, camera);
    raf = document.hidden ? 0 : requestAnimationFrame(loop);
  };
  const start = () => {
    if (raf || !animate) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };

  // Reduced motion: no loop; the camera cuts to the section on scroll.
  const still = () => {
    aim(stationAt());
    place(1);
    renderer.render(scene, camera);
  };

  const onScroll = () => !animate && still();
  const onResize = () => {
    measure();
    if (!animate) still();
  };
  // Section heights change as images load and content reveals.
  const ro = new ResizeObserver(onResize);
  ro.observe(document.body);
  const onVisibility = () => !document.hidden && start();
  const stopTheme = watchTheme(() => {
    system.setColors(themeColors());
    readFog();
    if (!animate) still();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  if (animate) window.addEventListener("pointermove", onMove, { passive: true });

  still();
  onReady();
  start();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    stopTheme();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onMove);
    system.dispose();
    renderer.dispose();
  };
}
