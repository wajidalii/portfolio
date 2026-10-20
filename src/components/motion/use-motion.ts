"use client";

import { useEffect, useState } from "react";

/** True when the user hasn't asked for reduced motion. */
export function prefersMotion(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True for a mouse/trackpad: hover-capable with a precise pointer. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Pointer-driven effects (cursor, tilt, magnetic, proximity type) only run
 * with a fine pointer and motion allowed. Starts false so server and first
 * client render match.
 */
export function usePointerFx(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(prefersMotion() && hasFinePointer());
  }, []);
  return ok;
}

export function useMotionOK(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(prefersMotion());
  }, []);
  return ok;
}
