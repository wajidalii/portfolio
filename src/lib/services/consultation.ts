/** Only a real, owner-configured 20-minute event belongs here. Never reuse the
 * existing portfolio's 15-minute event under a different label. */
export function consultationBookingUrl(value = process.env.CONSULTATION_BOOKING_URL): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password ||
        !["cal.com", "calendly.com", "www.calendly.com"].includes(url.hostname) ||
        url.port || url.pathname === "/") return null;
    return url.href;
  } catch { return null; }
}
