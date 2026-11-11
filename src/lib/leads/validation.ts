/** Shared browser/server contract. Never import DB, secrets or email here. */
export const serviceOptions = ["website", "saas", "automation", "not-sure"] as const;
export const budgetOptions = ["under-45000", "45000-95000", "95000-175000", "175000-plus", "discuss"] as const;
export const timelineOptions = ["asap", "1-3-months", "3-plus-months", "flexible"] as const;
export const contactMethodOptions = ["email", "consultation"] as const;
export const sourceOptions = ["services", "website", "saas", "automation", "case-study", "header", "footer"] as const;
export const leadStatuses = ["new", "contacted", "qualified", "discovery_scheduled", "proposal_sent", "negotiating", "won", "lost"] as const;
export const CONSENT_VERSION = "services-2026-11-11";
export const MAX_INQUIRY_BYTES = 16384;
export type Inquiry = {
  fullName: string; email: string; company: string; website: string; country: string;
  service: (typeof serviceOptions)[number]; budget: (typeof budgetOptions)[number];
  timeline: (typeof timelineOptions)[number]; description: string;
  contactMethod: (typeof contactMethodOptions)[number]; consent: true;
  acknowledgmentConsent: boolean; submissionId: string;
  source: (typeof sourceOptions)[number];
};
export type InquiryErrors = Partial<Record<keyof Inquiry | "websiteConfirmation" | "form", string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const SINGLE_LINE = /[\r\n]/;
export function validateInquiry(raw: unknown): { data?: Inquiry; errors: InquiryErrors; spam: boolean } {
  const errors: InquiryErrors = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { errors: { form: "Enter the project details." }, spam: false };
  const value = raw as Record<string, unknown>;
  const allowed = ["fullName", "email", "company", "website", "country", "service", "budget", "timeline", "description", "contactMethod", "consent", "acknowledgmentConsent", "submissionId", "source", "websiteConfirmation"];
  if (Object.keys(value).some((key) => !allowed.includes(key))) errors.form = "Unexpected form fields. Reload and try again.";
  const text = (key: keyof Inquiry, min: number, max: number, multiline = false) => {
    const field = value[key];
    const result = typeof field === "string" ? field.trim() : "";
    if (typeof field !== "string" || result.length < min || result.length > max || CONTROL.test(result) || (!multiline && SINGLE_LINE.test(result))) {
      errors[key] = `Enter ${min === 0 ? "up to" : `${min}–`} ${max} characters${min === 0 ? " or leave blank" : ""}.`;
    }
    return result;
  };
  const fullName = text("fullName", 2, 100);
  const email = text("email", 3, 254).toLowerCase();
  if (!EMAIL.test(email)) errors.email = "Enter a valid business email address.";
  const company = text("company", 2, 150);
  const website = text("website", 0, 500);
  if (website) {
    try { const url = new URL(website); if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || !url.hostname.includes(".")) throw new Error(); }
    catch { errors.website = "Enter a full http:// or https:// website URL."; }
  }
  const country = text("country", 2, 100);
  const description = text("description", 20, 5000, true);
  function option<T extends readonly string[]>(key: keyof Inquiry, options: T): T[number] {
    if (typeof value[key] !== "string" || !options.includes(value[key] as string)) errors[key] = "Choose one of the listed options.";
    return value[key] as T[number];
  }
  const service = option("service", serviceOptions), budget = option("budget", budgetOptions), timeline = option("timeline", timelineOptions), contactMethod = option("contactMethod", contactMethodOptions), source = option("source", sourceOptions);
  if (value.consent !== true) errors.consent = "Please consent to processing this inquiry.";
  if (value.acknowledgmentConsent !== undefined && typeof value.acknowledgmentConsent !== "boolean") errors.acknowledgmentConsent = "Choose whether you want an acknowledgment.";
  const submissionId = typeof value.submissionId === "string" ? value.submissionId : "";
  if (!UUID.test(submissionId)) errors.submissionId = "Reload the form and try again.";
  const honeypot = value.websiteConfirmation;
  const spam = typeof honeypot === "string" && honeypot.length > 0;
  if (honeypot !== undefined && typeof honeypot !== "string") errors.websiteConfirmation = "Invalid form field.";
  const data: Inquiry = { fullName, email, company, website, country, service, budget, timeline, description, contactMethod, consent: true, acknowledgmentConsent: value.acknowledgmentConsent === true, submissionId, source };
  return { data: Object.keys(errors).length ? undefined : data, errors, spam };
}
