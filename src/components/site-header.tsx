"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#upcoming-projects", label: "Upcoming" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setIsDark(current !== "light");
  }, []);

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIsDark(!isDark);
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/85 border-b border-border">
      <nav
        aria-label="Primary"
        className="max-w-[1180px] mx-auto px-6 py-3.5 flex items-center gap-6"
      >
        <a
          href="#main"
          className="flex items-center gap-2.5 font-display font-bold tracking-tight text-[17px] text-text"
        >
          <span className="grid place-items-center w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-accent to-accent-2 text-[#08090a] text-[13px] font-bold">
            WA
          </span>
          <span>
            Wajid Ali<span className="text-muted font-normal">.dev</span>
          </span>
        </a>

        <div className="hidden min-[880px]:flex items-center gap-1 ml-auto text-[14.5px]">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-muted hover:text-text hover:bg-surface-2"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5 ml-auto min-[880px]:ml-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
            title="Toggle light / dark"
            className="w-9 h-9 grid place-items-center rounded-[9px] border border-border bg-surface text-muted hover:text-text hover:border-accent font-mono text-[13px]"
          >
            {isDark ? "☀" : "☾"}
          </button>
          <Link
            href="#contact"
            className="hidden min-[880px]:inline-flex items-center px-4 py-2.5 rounded-[9px] bg-accent text-[#08090a] font-semibold text-[14.5px] whitespace-nowrap hover:bg-accent-2"
          >
            Get in touch
          </Link>
          <button
            type="button"
            className="min-[880px]:hidden w-9 h-9 items-center justify-center rounded-[9px] border border-border bg-surface text-text flex"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="grid gap-1">
              <span className="block w-4 h-[1.5px] bg-current" />
              <span className="block w-4 h-[1.5px] bg-current" />
              <span className="block w-4 h-[1.5px] bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-surface px-5 pt-2.5 pb-4.5 grid gap-0.5 min-[880px]:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-1.5 text-text border-b border-border"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 text-center py-3 rounded-[9px] bg-accent text-[#08090a] font-semibold"
          >
            Get in touch
          </a>
        </div>
      )}
    </header>
  );
}
