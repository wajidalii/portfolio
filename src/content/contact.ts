// Static, owner-curated (see ARCHITECTURE.md content model). "Book a
// 15-min call" CTAs open the Cal.com scheduler in a modal
// (components/book-call.tsx), falling back to a new tab.

/** Cal.com event (account: wajidalii.me@gmail.com). */
export const BOOKING_LINK = {
  path: "wajid-ali-3ikayp/15min",
  url: "https://cal.com/wajid-ali-3ikayp/15min",
};

export const contactLinks: { label: string; value: string; href: string; booking?: boolean }[] = [
  { label: "email", value: "hi@wajidali.dev", href: "mailto:hi@wajidali.dev" },
  { label: "info", value: "info@wajidali.dev", href: "mailto:info@wajidali.dev" },
  { label: "gmail", value: "wajidalii.me@gmail.com", href: "mailto:wajidalii.me@gmail.com" },
  { label: "cal.com", value: "15-min intro call", href: BOOKING_LINK.url, booking: true },
  { label: "linkedin", value: "/in/wajid-alii", href: "https://www.linkedin.com/in/wajid-alii/" },
  { label: "github", value: "@wajidalii", href: "https://github.com/wajidalii" },
];

export const regions = [
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Pakistan",
  "USA",
  "UK",
  "Malaysia",
  "Fully remote",
];
