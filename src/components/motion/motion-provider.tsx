"use client";

import { useEffect } from "react";
import { prefersMotion } from "./use-motion";

/**
 * Turns on scroll reveals for any element with a `data-reveal` attribute.
 *
 * Progressive enhancement: until this runs, nothing is hidden. It sets
 * html[data-motion="on"] (which is what makes un-revealed elements start
 * hidden) and marks each element `data-revealed` as it scrolls into view.
 * If the IntersectionObserver never reports back (the frame-commit bug in
 * ARCHITECTURE.md), a failsafe reveals everything.
 */
export function MotionProvider() {
  useEffect(() => {
    if (!prefersMotion() || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    let heardBack = false;

    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    // A clip-path "wipe" target reports zero visible area to the observer,
    // so we watch its parent and reveal the wipe children through this map.
    const proxies = new Map<Element, Element[]>();
    const target = (el: Element): Element => {
      if (el.getAttribute("data-reveal") !== "wipe" || !el.parentElement) return el;
      const parent = el.parentElement;
      const list = proxies.get(parent) ?? [];
      if (!list.includes(el)) list.push(el);
      proxies.set(parent, list);
      return parent;
    };

    const io = new IntersectionObserver(
      (entries) => {
        heardBack = true;
        for (const e of entries) {
          if (e.isIntersecting) {
            const wiped = proxies.get(e.target);
            if (wiped) {
              wiped.forEach(reveal);
              proxies.delete(e.target);
            }
            if (e.target.hasAttribute("data-reveal")) reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const watch = (scope: ParentNode) => {
      scope
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((el) => io.observe(target(el)));
    };

    // Stagger siblings that share a group, e.g. a grid of cards.
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      Array.from(group.querySelectorAll(":scope > [data-reveal]")).forEach(
        (el, i) => (el as HTMLElement).style.setProperty("--reveal-delay", `${i * 70}ms`),
      );
    });

    root.setAttribute("data-motion", "on");
    watch(document);

    // Content added later (e.g. the project filter) gets watched too.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches("[data-reveal]")) io.observe(target(n));
            watch(n);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const failsafe = window.setTimeout(() => {
      if (!heardBack) {
        document.querySelectorAll("[data-reveal]").forEach(reveal);
      }
    }, 2500);

    const revealAll = () => document.querySelectorAll("[data-reveal]").forEach(reveal);
    window.addEventListener("beforeprint", revealAll);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(failsafe);
      window.removeEventListener("beforeprint", revealAll);
      root.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
