"use client";

import { useRef, type ReactNode } from "react";
import { usePointerFx } from "./use-motion";

/**
 * Pulls its child toward the pointer while hovered (up to `strength` px),
 * then springs back on leave.
 */
export function Magnetic({
  children,
  strength = 10,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = usePointerFx();

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ref.current.style.transform = `translate3d(${dx * strength}px, ${dy * strength * 0.6}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-flex transition-transform duration-300 ease-[var(--ease-spring)] will-change-transform ${className}`}
    >
      {children}
    </span>
  );
}
