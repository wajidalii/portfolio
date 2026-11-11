"use client";

import { useEffect, useState } from "react";
import { originOf, setThemeAttr } from "@/components/theme/theme";

/** The stored preference is initialized before paint by the root layout. */
export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-label="Day theme"
      aria-checked={isLight}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="atelier-icon-button atelier-theme-toggle"
      onClick={(event) => {
        setThemeAttr("data-theme", isLight ? "dark" : "light", originOf(event.currentTarget));
        setIsLight(!isLight);
      }}
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {isLight ? <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></>}
      </svg>
    </button>
  );
}
