/** Optional, provider-neutral event bridge. No network request, storage, URL,
 * session ID or form value is included. An owner-installed subscriber may listen
 * for portfolio:conversion; enabling that subscriber requires a privacy review. */
export const conversionEvents = ["services_page_viewed", "service_cta_clicked", "inquiry_started", "inquiry_submitted_successfully", "booking_cta_clicked", "proposal_requested"] as const;
export type ConversionEvent = typeof conversionEvents[number];
export const conversionSources = ["services", "website", "saas", "automation", "case-study", "header", "footer"] as const;
export function conversionPayload(event: string, source?: string) {
  if (!(conversionEvents as readonly string[]).includes(event)) return null;
  return { event: event as ConversionEvent,
    source: (conversionSources as readonly string[]).includes(source ?? "") ? source! : "services" };
}
export function trackConversion(event: ConversionEvent, source = "services") {
  const detail = conversionPayload(event, source);
  if (detail && typeof window !== "undefined" && process.env.NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED === "true") {
    window.dispatchEvent(new CustomEvent("portfolio:conversion", { detail }));
  }
}
