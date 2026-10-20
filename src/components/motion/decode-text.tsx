"use client";

import { useEffect, useRef } from "react";
import { useMotionOK } from "./use-motion";

const GLYPHS = "▚▞▖▗▘▝#%&*+=/<>01ΔΣ";

/**
 * Text that scrambles through glyphs and resolves left→right when its
 * nearest link/button ancestor is hovered or focused. The real text is
 * always what screen readers get (the animated copy is aria-hidden).
 */
export function DecodeText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useMotionOK();

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const host = el.closest("a,button") ?? el;
    let raf = 0;

    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const dur = 380;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const solved = Math.floor(t * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += i < solved || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    host.addEventListener("pointerenter", run);
    host.addEventListener("focus", run);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focus", run);
      el.textContent = text;
    };
  }, [enabled, text]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      {/* Invisible copy holds the width so scrambling never shifts layout. */}
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span ref={ref} aria-hidden className="absolute inset-0 whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}
