"use client";

import { useEffect, useRef } from "react";

/**
 * Infinite stack marquee on an ice band. Runs left; flips
 * direction when the visitor scrolls up, and pauses on hover. The list is
 * duplicated for a seamless loop, so the visual copy is aria-hidden and a
 * plain list is provided for screen readers.
 */
export function StackTicker({ items }: { items: readonly string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (trackRef.current && Math.abs(y - lastY) > 2) {
        trackRef.current.style.animationDirection = y < lastY ? "reverse" : "normal";
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const loop = [...items, ...items];

  return (
    <div className="group relative overflow-hidden border-b border-border bg-accent text-on-accent py-4 sm:py-5 -rotate-[0.6deg] scale-[1.02]">
      <ul className="sr-only">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div
        ref={trackRef}
        aria-hidden
        className="flex w-max gap-10 sm:gap-14 whitespace-nowrap animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]"
      >
        {loop.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 sm:gap-14 font-wide font-extrabold text-[20px] sm:text-[26px] tracking-[-0.01em] uppercase"
          >
            {t}
            <span className="text-[0.8em] opacity-70">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
