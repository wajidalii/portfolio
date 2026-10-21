"use client";

import { useEffect, useRef } from "react";
import { prefersMotion } from "@/components/motion/use-motion";
import { cssRgb, onThemeChange } from "@/components/theme/theme";

/**
 * Ambient hero background: a grid of dots that swell and brighten around
 * the pointer (with a short ripple on click/tap), while a slow diagonal
 * wave keeps rolling across so it's alive even untouched or on a phone.
 * Reads the accent colour from CSS so it follows the theme.
 */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = canvas.parentElement!;

    const GAP = 26;
    let w = 0;
    let h = 0;
    let color = "169,199,232";
    let px = -9999;
    let py = -9999;
    const ripples: { x: number; y: number; t: number }[] = [];

    const readColor = () => {
      color = cssRgb("--accent-fg", color);
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time / 1000;
      // One colour per frame; per-dot opacity goes through globalAlpha, which
      // is far cheaper than building and parsing an rgba() string per dot.
      ctx.fillStyle = `rgb(${color})`;
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          // rolling diagonal wave
          let e = (Math.sin((x + y) * 0.012 - t * 1.4) + 1) / 2;
          e = e * e * 0.5;
          // pointer lens (squared-distance test before the sqrt)
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < 48400) e = Math.max(e, Math.pow(1 - Math.sqrt(d2) / 220, 1.4));
          // click ripples
          for (const r of ripples) {
            const age = t - r.t;
            const ring = Math.abs(Math.hypot(x - r.x, y - r.y) - age * 520);
            if (ring < 40) e = Math.max(e, (1 - ring / 40) * Math.max(0, 1 - age / 1.2));
          }
          const size = 1 + e * 3.6;
          ctx.globalAlpha = 0.12 + e * 0.85;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;
      while (ripples.length && t - ripples[0].t > 1.2) ripples.shift();
    };

    readColor();
    resize();

    if (!prefersMotion()) {
      draw(0);
      return onThemeChange(() => {
        readColor();
        draw(0);
      });
    }

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      px = p.x;
      py = p.y;
    };
    const onLeave = () => {
      px = py = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      ripples.push({ x: p.x, y: p.y, t: performance.now() / 1000 });
    };

    let raf = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const stopTheme = onThemeChange(readColor);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      stopTheme();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 pointer-events-none" />;
}
