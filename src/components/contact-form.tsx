"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, type ContactFormState } from "@/app/(site)/contact-actions";

const initialState: ContactFormState = { errors: {}, status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="border border-border rounded-2xl bg-bg p-6 sm:p-8 grid gap-4.5"
    >
      <div className="grid gap-4.5 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <div className="grid gap-1.5">
          <label htmlFor="f-name" className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-muted">
            Your name *
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            aria-describedby="e-name"
            placeholder="Sara Al-Mansoori"
            className="rounded-[10px] border border-border bg-surface px-3.5 py-3 text-text"
          />
          <span id="e-name" role="alert" className="min-h-4 text-[12.5px] font-mono text-red-400">
            {state.errors.name}
          </span>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="f-email" className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-muted">
            Work email *
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby="e-email"
            placeholder="you@company.com"
            className="rounded-[10px] border border-border bg-surface px-3.5 py-3 text-text"
          />
          <span id="e-email" role="alert" className="min-h-4 text-[12.5px] font-mono text-red-400">
            {state.errors.email}
          </span>
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="f-topic" className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-muted">
          What&apos;s this about?
        </label>
        <select
          id="f-topic"
          name="topic"
          defaultValue="Full-time role"
          className="rounded-[10px] border border-border bg-surface px-3.5 py-3 text-text"
        >
          <option>Full-time role</option>
          <option>Contract / consulting</option>
          <option>Technical advisory</option>
          <option>Something else</option>
        </select>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="f-msg" className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-muted">
          Message *
        </label>
        <textarea
          id="f-msg"
          name="message"
          rows={5}
          aria-describedby="e-msg"
          placeholder="Role, team size, stack, and what's currently breaking."
          className="rounded-[10px] border border-border bg-surface px-3.5 py-3 text-text resize-y"
        />
        <span id="e-msg" role="alert" className="min-h-4 text-[12.5px] font-mono text-red-400">
          {state.errors.message}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[11px] bg-accent text-[#08090a] font-semibold text-[15.5px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
        </button>
        <span role="status" className="font-mono text-[12.5px]">
          {state.status === "success" && (
            <span className="text-accent-2-fg">
              ✓ Thanks — I&apos;ll reply within one business day.
            </span>
          )}
          {state.status === "error" && (
            <span className="text-red-400">{state.serverError}</span>
          )}
        </span>
      </div>
    </form>
  );
}
