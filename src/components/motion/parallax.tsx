"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersMotion } from "./use-motion";

/** Shifts its content vertically by `speed` × scroll distance. */
export function Parallax({ children, speed = -0.2 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !prefersMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.5);
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <span ref={ref} className="block will-change-transform">
      {children}
    </span>
  );
}
