import { Resend } from "resend";

const CONTACT_DESTINATION = "wajidalii.me@gmail.com";
// Resend's shared test sender — works without verifying a custom domain.
// Once a real domain is set up, override with CONTACT_FROM_EMAIL.
const DEFAULT_FROM = "Portfolio contact form <onboarding@resend.dev>";

export type ContactFormFields = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export async function sendContactEmail(fields: ContactFormFields): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;

  const { error } = await resend.emails.send({
    from,
    to: CONTACT_DESTINATION,
    replyTo: fields.email,
    subject: `[Portfolio] ${fields.topic} — ${fields.name}`,
    text: [
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      `Topic: ${fields.topic}`,
      "",
      fields.message,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}
