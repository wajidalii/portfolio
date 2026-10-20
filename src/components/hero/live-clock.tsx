"use client";

import { useEffect, useState } from "react";

/** HH:MM:SS for an IANA time zone, ticking every second. */
export function LiveClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <time className="lcd-text tabular-nums" suppressHydrationWarning>
      {now ?? "--:--:--"}
    </time>
  );
}
