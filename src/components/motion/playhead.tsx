"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps a timeline list. As the viewport centre moves through it, the rail
 * fill (`.playhead-fill`) grows and the `<li>` under the playhead gets
 * `data-active`. Without JS every role renders fully lit.
 */
export function Playhead({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fill = root.querySelector<HTMLElement>(".playhead-fill");
    const items = Array.from(root.querySelectorAll<HTMLElement>("ol > li"));
    root.dataset.live = "true";
    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      if (!visible) return;
      const r = root.getBoundingClientRect();
      const line = window.innerHeight * 0.5;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      if (fill) fill.style.transform = `scaleY(${p})`;
      let active = items[0];
      for (const li of items) if (li.getBoundingClientRect().top < line) active = li;
      items.forEach((li) => li.toggleAttribute("data-active", li === active));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    // Observe the section box, not a descendant of skipped content. Reading
    // descendant geometry would force content-visibility to lay it out early.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    observer.observe(root.closest("[data-station]") ?? root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      cancelAnimationFrame(raf);
      delete root.dataset.live;
    };
  }, []);

  return (
    <div ref={ref} className={`playhead relative ${className}`}>
      {children}
    </div>
  );
}
