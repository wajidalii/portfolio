"use client";

import { useEffect, useState } from "react";
import { STATIONS } from "./stations";

/**
 * Route rail on the right edge (wide screens): one node per station, the
 * current one lit, the line filled up to it. Each node jumps to its section.
 */
export function StationRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.5;
      let current = 0;
      document.querySelectorAll<HTMLElement>("[data-station]").forEach((el) => {
        if (el.getBoundingClientRect().top < line) current = Number(el.dataset.station);
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      aria-label="System map"
      className="hidden min-[1360px]:block fixed right-6 top-1/2 -translate-y-1/2 z-40"
    >
      <ol className="station-rail list-none m-0 p-0 grid gap-3.5 relative">
        <span aria-hidden className="absolute right-[5px] top-1.5 bottom-1.5 w-px bg-border" />
        <span
          aria-hidden
          className="absolute right-[5px] top-1.5 w-px bg-accent origin-top transition-[height] duration-500 ease-[var(--ease-out-expo)]"
          style={{ height: `calc((100% - 12px) * ${active / (STATIONS.length - 1)})` }}
        />
        {STATIONS.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.id} className="relative">
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className="group flex items-center justify-end gap-3 font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                <span
                  className={`transition-all duration-300 ${
                    on
                      ? "text-accent-fg opacity-100"
                      : "text-muted opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100"
                  }`}
                >
                  {s.node}
                </span>
                <span
                  aria-hidden
                  className={`relative z-10 block w-[11px] h-[11px] rounded-full border transition-all duration-300 ${
                    i <= active ? "border-accent bg-accent" : "border-border bg-bg group-hover:border-accent"
                  } ${on ? "scale-125 shadow-[0_0_0_4px_var(--glow),0_0_12px_var(--accent)]" : ""}`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
