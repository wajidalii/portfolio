"use client";

import type { MouseEvent, ReactNode } from "react";
import { getCalApi } from "@calcom/embed-react";
import { BOOKING_LINK } from "@/content/contact";

const NAMESPACE = "book-call";
const LOAD_TIMEOUT_MS = 4000;

function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Cal.com UI config matching the live mode + palette. */
function calUi() {
  const light = document.documentElement.getAttribute("data-theme") === "light";
  return {
    theme: light ? ("light" as const) : ("dark" as const),
    layout: "month_view" as const,
    cssVarsPerTheme: {
      light: { "cal-brand": token("--accent-fg") },
      dark: { "cal-brand": token("--accent") },
    },
  };
}

let calPromise: ReturnType<typeof getCalApi> | null = null;
/** Loads Cal's embed script once; later calls reuse it. */
function loadCal() {
  calPromise ??= getCalApi({ namespace: NAMESPACE });
  return calPromise;
}

/**
 * A link that opens the Cal.com booking modal (date + time picker) over the
 * page. Modified clicks, no-JS, or an embed that fails to load in time all
 * fall back to the booking page in a new tab. The embed script is fetched
 * on hover/focus so the modal opens without a visible wait.
 */
export function BookCallLink({ className, children }: { className?: string; children: ReactNode }) {
  const open = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    try {
      const cal = await Promise.race([
        loadCal(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), LOAD_TIMEOUT_MS)),
      ]);
      const ui = calUi();
      cal("ui", ui);
      cal("modal", { calLink: BOOKING_LINK.path, config: { layout: ui.layout, theme: ui.theme } });
    } catch {
      window.open(BOOKING_LINK.url, "_blank", "noopener");
    }
  };

  return (
    <a
      href={BOOKING_LINK.url}
      target="_blank"
      rel="noopener"
      onClick={open}
      onPointerEnter={() => void loadCal()}
      onFocus={() => void loadCal()}
      className={className}
    >
      {children}
    </a>
  );
}
