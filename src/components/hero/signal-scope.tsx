"use client";

import { useEffect, useRef } from "react";
import { prefersMotion } from "@/components/motion/use-motion";

/**
 * Oscilloscope trace on a canvas. Idles as a calm sine; pointer speed
 * anywhere on the page pumps the amplitude and adds harmonics, then it
 * decays back. Pauses when off-screen. Reduced motion draws one still frame.
 */
export function SignalScope({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let energy = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const v = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt;
      energy = Math.min(1, energy + v * 0.08);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    const ice = "#A9C7E8";
    let phase = 0;
    let raf = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // graticule
      ctx.strokeStyle = "rgba(169,199,232,0.09)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= w; gx += w / 10) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy <= h; gy += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const amp = h * (0.12 + energy * 0.3);
      const mid = h / 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const t = x / w;
        const y =
          mid +
          Math.sin(t * Math.PI * 4 + phase) * amp +
          Math.sin(t * Math.PI * 11 - phase * 1.7) * amp * 0.35 * energy +
          Math.sin(t * Math.PI * 23 + phase * 3.1) * amp * 0.15 * energy;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ice;
      ctx.lineWidth = 2;
      ctx.shadowColor = ice;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (readoutRef.current) {
        const hz = (2.0 + energy * 46).toFixed(1).padStart(4, "0");
        readoutRef.current.textContent = `${hz} Hz · ${Math.round(energy * 100)
          .toString()
          .padStart(3, "0")}%`;
      }
    };

    const tick = () => {
      phase += 0.035 + energy * 0.12;
      energy *= 0.965;
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    if (!prefersMotion()) {
      draw();
      window.addEventListener("resize", () => {
        resize();
        draw();
      });
      return;
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={`lcd relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="block w-full h-full" />
      <span
        ref={readoutRef}
        aria-hidden
        className="absolute right-2.5 bottom-2 font-mono text-[9.5px] tracking-[0.1em] text-lcd-muted tabular-nums"
      >
        02.0 Hz · 000%
      </span>
    </div>
  );
}
