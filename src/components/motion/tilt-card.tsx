"use client";

import { useRef, type ReactNode } from "react";
import { usePointerFx } from "./use-motion";

/**
 * 3D tilt toward the pointer, a zoom-in, and a soft spotlight that follows it.
 * Sets --mx/--my (spotlight position, %) on the element; the `.tilt-card`
 * CSS in globals draws the light. Without a fine pointer it's a plain div.
 */
export function TiltCard({
  children,
  className = "",
  max = 6,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const enabled = usePointerFx();
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translate3d(0, -4px, 0) scale(1.04)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </Tag>
  );
}
