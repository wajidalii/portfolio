"use client";

import { useEffect, useRef } from "react";
import { prefersMotion } from "./use-motion";

/**
 * Renders `value` exactly (server + no-JS), then — if motion is allowed —
 * rolls up from zero the first time it scrolls into view. Width is held
 * with tabular numerals so the digits never jiggle the layout.
 */
export function CountUp({
  value,
  duration = 1400,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = parseFloat(value);
    if (!el || !prefersMotion() || Number.isNaN(target) || !("IntersectionObserver" in window)) return;
    const decimals = (value.split(".")[1] ?? "").length;
    const width = value.length;
    let raf = 0;

    const fmt = (n: number) => n.toFixed(decimals).padStart(width, "0");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = t < 1 ? fmt(target * eased) : value;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        el.textContent = fmt(0);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
