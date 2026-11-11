import { Resend } from "resend";
import type { ReceivedLead } from "./handler";

export type InquiryEmail = { from: string; to: string; replyTo?: string; subject: string; text: string };
export type InquiryEmailSender = (email: InquiryEmail, idempotencyKey: string) => Promise<void>;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i;
const OWNER = "wajidalii.me@gmail.com";
export function acknowledgmentConfigured(env: Readonly<Record<string, string | undefined>> = process.env) {
  const from = env.CONTACT_FROM_EMAIL?.trim();
  return env.INQUIRY_ACKNOWLEDGMENTS_ENABLED === "true" && Boolean(env.RESEND_API_KEY && from && !/[\r\n]/.test(from) && !from.includes("resend.dev"));
}
export function ownerInquiryEmail(lead: ReceivedLead, env: Readonly<Record<string, string | undefined>> = process.env): InquiryEmail {
  const destination = env.LEAD_NOTIFICATION_EMAIL || OWNER;
  if (!EMAIL.test(destination)) throw new Error("Invalid notification configuration");
  const from = env.CONTACT_FROM_EMAIL || "Portfolio inquiries <onboarding@resend.dev>";
  if (/[\r\n]/.test(from)) throw new Error("Invalid sender configuration");
  return {
    from, to: destination, replyTo: lead.email,
    subject: `[Services inquiry] ${lead.service} — ${lead.company}`,
    text: [
      "A qualified project inquiry was saved to the private lead dashboard.",
      `Name: ${lead.fullName}`, `Email: ${lead.email}`, `Company: ${lead.company}`,
      `Website: ${lead.website || "Not supplied"}`, `Country: ${lead.country}`,
      `Service: ${lead.service}`, `Budget: ${lead.budget}`, `Timeline: ${lead.timeline}`,
      `Preferred contact: ${lead.contactMethod}`, `Source: ${lead.source}`,
      "", lead.description,
      "", "Review and update the lead in /admin/leads. Do not forward private project details unnecessarily.",
    ].join("\n"),
  };
}
export function acknowledgmentEmail(lead: ReceivedLead, env: Readonly<Record<string, string | undefined>> = process.env): InquiryEmail {
  if (!acknowledgmentConfigured(env) || !lead.acknowledgmentConsent) throw new Error("Acknowledgment not configured or consented");
  return {
    from: env.CONTACT_FROM_EMAIL!, to: lead.email, replyTo: OWNER,
    subject: "Your project inquiry has been received — Wajid Ali",
    text: `Hello ${lead.fullName},\n\nThank you for sharing your project inquiry. It has been saved for review. I’ll reply by email to discuss fit, scope and next steps. This acknowledgment does not confirm a booking, price or delivery commitment.\n\nWajid Ali\nhttps://wajidali.dev/services\n${OWNER}\n\nYou received this one-time acknowledgment because you requested it on the inquiry form. No marketing subscription was created.`,
  };
}
export const sendInquiryEmail: InquiryEmailSender = async (email, idempotencyKey) => {
  if (!process.env.RESEND_API_KEY) throw new Error("Email delivery unavailable");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send(email, { idempotencyKey });
  if (error) throw new Error("Email delivery failed");
};
