import { prefersMotion } from "@/components/motion/use-motion";

/**
 * Sets a theme attribute on <html> and stores it. With View Transitions and
 * motion allowed, the new theme is revealed as a circle growing from the
 * point the user clicked; otherwise it switches instantly.
 */
export function setThemeAttr(
  attr: "data-theme" | "data-palette",
  value: string,
  origin?: { x: number; y: number },
) {
  const apply = () => {
    document.documentElement.setAttribute(attr, value);
    try {
      localStorage.setItem(attr === "data-theme" ? "theme" : "palette", value);
    } catch {}
  };

  if (!document.startViewTransition || !prefersMotion()) {
    apply();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

/** Centre of the clicked control, for the reveal origin. */
export function originOf(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
