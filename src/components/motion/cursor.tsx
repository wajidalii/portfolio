"use client";

import { useEffect, useRef } from "react";
import { usePointerFx } from "./use-motion";

/**
 * Reticle cursor: a crosshair dot that tracks the pointer exactly, a ring
 * that trails it, and a mono readout with live X/Y. Over interactive
 * elements the ring grows and shows a label (from `data-cursor`, or a
 * sensible default). Mouse/trackpad only; reduced motion keeps the native
 * cursor.
 */
export function Cursor() {
  const enabled = usePointerFx();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const read = readRef.current!;
    const label = labelRef.current!;
    const root = document.documentElement;

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let shown = false;

    const labelFor = (el: Element | null): string | null => {
      if (!el) return null;
      const target = el.closest<HTMLElement>("[data-cursor],a,button,summary,label,select");
      if (!target) return null;
      if (target.dataset.cursor !== undefined) return target.dataset.cursor || "";
      if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute("href") ?? "";
        if (href.startsWith("http")) return "OPEN ↗";
        if (href.startsWith("mailto:")) return "WRITE";
        return "GO";
      }
      if (target.tagName === "SUMMARY") return "EXPAND";
      return "PRESS";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        root.setAttribute("data-cursor", "on");
        dot.style.opacity = ring.style.opacity = read.style.opacity = "1";
      }
      const l = labelFor(e.target as Element);
      if (l === null) {
        ring.dataset.active = "";
        delete ring.dataset.active;
        label.textContent = "";
      } else {
        ring.dataset.active = "true";
        label.textContent = l;
      }
    };

    const onLeave = () => {
      dot.style.opacity = ring.style.opacity = read.style.opacity = "0";
      shown = false;
      root.removeAttribute("data-cursor");
    };

    const onDown = () => ring.setAttribute("data-down", "");
    const onUp = () => ring.removeAttribute("data-down");

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      read.style.transform = `translate3d(${x + 18}px, ${y + 18}px, 0)`;
      read.textContent = `X${String(Math.round(x)).padStart(4, "0")} Y${String(Math.round(y)).padStart(4, "0")}`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.removeAttribute("data-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-200"
      >
        <span className="absolute -left-[7px] top-0 h-px w-[15px] bg-accent" />
        <span className="absolute left-0 -top-[7px] h-[15px] w-px bg-accent" />
      </div>
      <div
        ref={ringRef}
        className="cursor-ring absolute left-0 top-0 opacity-0 transition-opacity duration-200"
      >
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div
        ref={readRef}
        className="absolute left-0 top-0 font-mono text-[9.5px] tracking-[0.08em] text-muted opacity-0 tabular-nums whitespace-nowrap"
      />
    </div>
  );
}
