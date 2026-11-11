"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { conversionPayload, trackConversion } from "@/lib/services/analytics";

export function ConversionEvents() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/services") trackConversion("services_page_viewed");
    const clicked = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const node = event.target.closest<HTMLElement>("[data-conversion]");
      const payload = conversionPayload(node?.dataset.conversion ?? "", node?.dataset.source);
      if (payload) trackConversion(payload.event, payload.source);
    };
    document.addEventListener("click", clicked);
    return () => document.removeEventListener("click", clicked);
  }, [pathname]);
  return null;
}
