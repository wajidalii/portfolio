"use client";

import { useEffect, useRef, useState } from "react";
import { prefersMotion } from "@/components/motion/use-motion";

/**
 * Fixed full-viewport 3D stage behind the page (see stage-runtime). The
 * three.js chunk loads once the browser is idle, then fades in. Without
 * WebGL the page simply keeps its flat dotted background.
 */
export function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const start = () =>
      import("./stage-runtime")
        .then(({ mountStage }) => {
          if (cancelled) return;
          dispose = mountStage(canvas, { animate: prefersMotion(), onReady: () => setReady(true) });
        })
        .catch(() => {});

    const idle = "requestIdleCallback" in window;
    const handle = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`stage fixed inset-0 z-0 w-full h-full pointer-events-none transition-opacity duration-[1600ms] ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
