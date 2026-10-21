import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { LAYOUTS, type ScenePreset } from "./layouts";
import { buildSystem, type System } from "./system-graph";
import { focalPx, frame, radiusOf, themeColors, watchTheme } from "./scene-utils";

/*
 * Small 3D accents (project cards, CTA) share ONE WebGL context: each view
 * is rendered into the corner of an offscreen canvas, then copied into the
 * view's own 2D canvas. Many views, one GPU context, no per-card setup cost.
 */

type View = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: Scene;
  camera: PerspectiveCamera;
  system: System;
  radius: number;
  fill: number;
  w: number;
  h: number;
  visible: boolean;
  tilt: { x: number; y: number; tx: number; ty: number };
};

let renderer: WebGLRenderer | null = null;
const views = new Set<View>();
let raf = 0;
let last = 0;
let animate = true;
let stopTheme: (() => void) | null = null;

function draw(view: View) {
  const gl = renderer!;
  const { w, h } = view;
  if (!w || !h) return;
  const glCanvas = gl.domElement;
  if (glCanvas.width < w || glCanvas.height < h) {
    gl.setSize(Math.max(glCanvas.width, w), Math.max(glCanvas.height, h), false);
  }
  gl.setViewport(0, 0, w, h);
  gl.setScissor(0, 0, w, h);
  gl.setScissorTest(true);
  gl.render(view.scene, view.camera);
  // WebGL's origin is bottom-left, so the view occupies the bottom rows.
  view.ctx.clearRect(0, 0, w, h);
  view.ctx.drawImage(glCanvas, 0, glCanvas.height - h, w, h, 0, 0, w, h);
}

function loop(now: number) {
  const dt = Math.max(0, now - last) / 1000;
  last = now;
  let any = false;
  for (const v of views) {
    if (!v.visible) continue;
    any = true;
    v.tilt.x += (v.tilt.tx - v.tilt.x) * 0.06;
    v.tilt.y += (v.tilt.ty - v.tilt.y) * 0.06;
    v.scene.rotation.set(v.tilt.x, v.tilt.y, 0);
    v.system.update(dt);
    draw(v);
  }
  raf = any && !document.hidden ? requestAnimationFrame(loop) : 0;
}

function kick() {
  if (raf || !animate) return;
  last = performance.now();
  raf = requestAnimationFrame(loop);
}

function onVisibility() {
  if (!document.hidden) kick();
}

/** Renders `preset` into `canvas`; the pointer over `host` tilts it. */
export function mountView(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  preset: ScenePreset,
  opts: { animate: boolean; fill?: number },
) {
  animate = opts.animate;
  if (!renderer) {
    renderer = new WebGLRenderer({ canvas: document.createElement("canvas"), antialias: true, alpha: true });
    renderer.setPixelRatio(1); // views size themselves in device pixels
    renderer.setClearColor(0x000000, 0);
    stopTheme = watchTheme(() => {
      const c = themeColors();
      for (const v of views) {
        v.system.setColors(c);
        if (!animate && v.visible) draw(v);
      }
    });
    document.addEventListener("visibilitychange", onVisibility);
  }

  const system = buildSystem(LAYOUTS[preset](), themeColors());
  const scene = new Scene();
  scene.add(system.group);
  const view: View = {
    canvas,
    ctx: canvas.getContext("2d")!,
    scene,
    camera: new PerspectiveCamera(34, 1, 0.1, 200),
    system,
    radius: radiusOf(system.positions),
    fill: opts.fill ?? 1.1,
    w: 0,
    h: 0,
    visible: false,
    tilt: { x: 0, y: 0, tx: 0, ty: 0 },
  };
  for (let i = 0; i < 90; i++) system.update(1 / 30);

  const ro = new ResizeObserver(() => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    view.w = Math.round(r.width * dpr);
    view.h = Math.round(r.height * dpr);
    canvas.width = view.w;
    canvas.height = view.h;
    view.camera.aspect = r.width / Math.max(1, r.height);
    frame(view.camera, view.radius, view.fill);
    system.setScale(focalPx(view.camera, view.h));
    if (view.visible) draw(view);
  });
  ro.observe(canvas);

  const io = new IntersectionObserver(([e]) => {
    view.visible = e.isIntersecting;
    if (view.visible) {
      draw(view);
      kick();
    }
  });
  io.observe(canvas);

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    view.tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.7;
    view.tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
  };
  const onLeave = () => {
    view.tilt.tx = view.tilt.ty = 0;
  };
  if (animate) {
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
  }

  views.add(view);

  return () => {
    views.delete(view);
    ro.disconnect();
    io.disconnect();
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    system.dispose();
    if (views.size === 0 && renderer) {
      cancelAnimationFrame(raf);
      raf = 0;
      stopTheme?.();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
      renderer = null;
    }
  };
}
