"use server";

import { sendContactEmail } from "@/lib/email";
import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";

export type ContactFormState = {
  errors: { name?: string; email?: string; message?: string };
  status: "idle" | "success" | "error";
  serverError?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function validate(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: ContactFormState["errors"] = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid work email.";
  if (message.length < 20) errors.message = "A little more detail helps — 20+ characters.";

  return { name, email, message, errors };
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const { name, email, message, errors } = validate(formData);
  const topic = String(formData.get("topic") ?? "Something else");

  if (Object.keys(errors).length > 0) {
    return { errors, status: "idle" };
  }

  await db.insert(contactSubmissions).values({ name, email, topic, message });

  try {
    await sendContactEmail({ name, email, topic, message });
  } catch (err) {
    console.error("[contact-form] send failed:", err);
    return {
      errors: {},
      status: "error",
      serverError: "Something went wrong sending your message — please email me directly instead.",
    };
  }

  return { errors: {}, status: "success" };
}
