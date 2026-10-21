"use client";

import { useEffect, useRef } from "react";
import { usePointerFx } from "./use-motion";

/**
 * Splits text into letters whose variable-font width and weight swell as
 * the pointer approaches (Archivo `wdth` 62–125, `wght` 100–900).
 *
 * Screen readers and crawlers get the plain string from an sr-only copy;
 * the letter spans are aria-hidden. With no pointer effects, the letters sit at
 * the resting axes and a gentle CSS "breathing" wave plays instead.
 */
export function ProximityType({
  text,
  radius = 260,
  rest = { wdth: 92, wght: 720 },
  peak = { wdth: 125, wght: 900 },
  className = "",
  accentLast = false,
}: {
  text: string;
  radius?: number;
  rest?: { wdth: number; wght: number };
  peak?: { wdth: number; wght: number };
  className?: string;
  accentLast?: boolean;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const enabled = usePointerFx();

  useEffect(() => {
    const root = wrap.current;
    if (!enabled || !root) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-ch]"));
    let centers: { x: number; y: number }[] = [];
    let px = -9999;
    let py = -9999;
    let raf = 0;
    let dirty = true;

    const measure = () => {
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const tick = () => {
      if (dirty) {
        measure();
        dirty = false;
      }
      letters.forEach((l, i) => {
        const c = centers[i];
        const d = Math.hypot(px - c.x, py - c.y);
        const k = Math.max(0, 1 - d / radius);
        const e = k * k * (3 - 2 * k); // smoothstep
        const w = rest.wdth + (peak.wdth - rest.wdth) * e;
        const g = rest.wght + (peak.wght - rest.wght) * e;
        l.style.fontVariationSettings = `"wdth" ${w.toFixed(1)}, "wght" ${g.toFixed(0)}`;
      });
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const onDirty = () => (dirty = true);

    root.dataset.live = "true";
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onDirty, { passive: true });
    window.addEventListener("resize", onDirty);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onDirty);
      window.removeEventListener("resize", onDirty);
      delete root.dataset.live;
      letters.forEach((l) => (l.style.fontVariationSettings = ""));
    };
  }, [enabled, radius, rest.wdth, rest.wght, peak.wdth, peak.wght]);

  const chars = Array.from(text);

  return (
    <span
      ref={wrap}
      className={`proximity inline-block ${className}`}
      style={
        {
          "--rest": `"wdth" ${rest.wdth}, "wght" ${rest.wght}`,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          data-ch={ch === " " ? undefined : ""}
          className={`proximity-ch ${accentLast && i === chars.length - 1 ? "text-accent-fg" : ""}`}
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
