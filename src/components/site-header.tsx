"use client";

import { useEffect, useRef, useState } from "react";
import { DecodeText } from "@/components/motion/decode-text";
import { Magnetic } from "@/components/motion/magnetic";
import { PalettePicker, PaletteRow } from "@/components/theme/palette-picker";
import { originOf, setThemeAttr } from "@/components/theme/theme";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#upcoming-projects", label: "Upcoming" },
];

/**
 * Header = the instrument's top panel: a 4-digit tape counter (scroll
 * position), the current channel (scroll-spied from `[data-channel]`
 * sections), decode-on-hover nav, and a hardware Night/Day switch.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [hidden, setHidden] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const channelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
  }, []);

  // Tape counter, progress bar, channel display, hide-on-scroll-down.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const sections = document.querySelectorAll<HTMLElement>("[data-channel]");
    const update = () => {
      raf = 0;
      // All layout reads first, then writes, so a frame never forces a
      // second synchronous layout.
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      let current = "CH·00 POWER ON";
      const line = window.innerHeight * 0.4;
      for (const s of sections) {
        if (s.getBoundingClientRect().top < line) current = s.dataset.channel!;
        else break;
      }

      if (counterRef.current)
        counterRef.current.textContent = String(Math.round(p * 1000)).padStart(4, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (channelRef.current && channelRef.current.textContent !== current)
        channelRef.current.textContent = current;

      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }
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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function toggleTheme(e: React.MouseEvent<HTMLButtonElement>) {
    setThemeAttr("data-theme", isDark ? "light" : "dark", originOf(e.currentTarget));
    setIsDark(!isDark);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-expo)] ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        aria-label="Primary"
        className="max-w-[1240px] mx-auto px-5 sm:px-8 py-3 flex items-center gap-4 lg:gap-6"
      >
        <a href="#main" className="group flex items-center gap-3 text-text">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[5px] bg-accent text-on-accent text-[12.5px] font-black font-wide shadow-[0_3px_0_var(--accent-deep)] transition-transform duration-200 group-hover:-rotate-6 group-active:translate-y-[3px] group-active:shadow-none">
            WA
          </span>
          <span className="font-wide font-extrabold text-[15.5px] tracking-[-0.01em] whitespace-nowrap">
            WAJID ALI
          </span>
        </a>

        <div
          aria-hidden
          className="hidden sm:flex lcd items-center gap-3 px-3 py-1.5"
          title="Scroll position · current section"
        >
          <span ref={counterRef} className="lcd-text text-[13px]">
            0000
          </span>
          <span
            ref={channelRef}
            className="font-mono text-[9.5px] tracking-[0.14em] text-lcd-muted uppercase w-[150px] truncate"
          >
            CH·00 POWER ON
          </span>
        </div>

        <div className="hidden min-[960px]:flex items-center gap-0.5 ml-auto text-[14px]">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              <DecodeText text={l.label} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto min-[960px]:ml-0">
          <span className="hidden sm:block">
            <PalettePicker />
          </span>
          <div className="flex items-center gap-2">
            <span aria-hidden className={`label-mono !text-[9px] hidden sm:inline ${isDark ? "!text-text" : ""}`}>
              Night
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!isDark}
              onClick={toggleTheme}
              aria-label="Day theme"
              className="relative w-[58px] h-[28px] rounded-[5px] lcd !border-border"
            >
              <span
                aria-hidden
                className={`absolute top-[3px] left-[3px] w-[24px] h-[20px] rounded-[3px] border border-border bg-surface-2 shadow-[0_2px_0_rgba(0,0,0,.35)] transition-transform duration-300 ease-[var(--ease-spring)] grid place-items-center ${
                  isDark ? "translate-x-0" : "translate-x-[26px]"
                }`}
              >
                <span className={`block w-[2px] h-[10px] rounded-full ${isDark ? "bg-muted" : "bg-accent"}`} />
              </span>
            </button>
            <span aria-hidden className={`label-mono !text-[9px] hidden sm:inline ${!isDark ? "!text-text" : ""}`}>
              Day
            </span>
          </div>

          <span className="hidden min-[960px]:inline-flex">
          <Magnetic strength={6}>
            <a
              href="#contact"
              className="inline-flex items-center px-4 py-2.5 rounded-md bg-accent text-on-accent font-semibold text-[14px] whitespace-nowrap shadow-[0_3px_0_var(--accent-deep)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none font-semiwide"
            >
              Get in touch
            </a>
          </Magnetic>
          </span>

          <button
            type="button"
            className="min-[960px]:hidden w-10 h-10 grid place-items-center rounded-md border border-border bg-surface text-text"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block w-4 h-3">
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all duration-300 ${menuOpen ? "top-[5px] rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-[5px] h-[1.5px] w-4 bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all duration-300 ${menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Scroll progress — the tape running. */}
      <div aria-hidden className="absolute left-0 right-0 bottom-[-1px] h-[2px]">
        <div ref={barRef} className="h-full bg-accent origin-left scale-x-0" />
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="min-[960px]:hidden border-t border-border bg-surface px-5 pt-3 pb-6"
      >
        <ul className="list-none m-0 p-0">
          {NAV_LINKS.map((l, i) => (
            <li
              key={l.href}
              className="border-b border-border animate-[menu-in_.5s_var(--ease-out-expo)_both]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-baseline justify-between py-3.5 text-text"
              >
                <span className="font-wide font-extrabold text-[26px] tracking-[-0.02em]">
                  {l.label}
                </span>
                <span className="font-mono text-[11px] text-muted">CH·0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="label-mono">Palette</span>
          <PaletteRow />
        </div>
        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="mt-5 flex justify-center py-3.5 rounded-md bg-accent text-on-accent font-semibold shadow-[0_3px_0_var(--accent-deep)]"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
