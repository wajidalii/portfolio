"use client";

import { useEffect, useRef, useState } from "react";
import { prefersMotion } from "@/components/motion/use-motion";
import type { ScenePreset } from "./layouts";

/**
 * A small 3D system diagram (shared WebGL context, see views-runtime). The
 * three.js chunk is only fetched once the view nears the viewport. Its
 * parent element is the pointer-tilt target and must be positioned.
 */
export function SystemView({
  preset,
  fill,
  className = "",
}: {
  preset: ScenePreset;
  fill?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas?.parentElement) return;
    const host = canvas.parentElement;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        import("./views-runtime")
          .then(({ mountView }) => {
            if (cancelled) return;
            dispose = mountView(canvas, host, preset, { animate: prefersMotion(), fill });
            setReady(true);
          })
          .catch(() => {}); // no WebGL: the static placeholder underneath stays
      },
      { rootMargin: "300px" },
    );
    near.observe(canvas);
    return () => {
      cancelled = true;
      near.disconnect();
      dispose?.();
    };
  }, [preset, fill]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
