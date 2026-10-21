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
      className="reg-marks relative border border-border rounded-lg bg-bg p-6 sm:p-8 grid gap-4.5"
    >
      <div className="flex justify-between items-center -mt-1 mb-1">
        <span className="label-mono">{"// transmit"}</span>
        <span className="label-mono inline-flex items-center gap-2">
          <span aria-hidden className={`led !w-[7px] !h-[7px] ${pending ? "led-blink" : ""}`} />
          {pending ? "Transmitting" : state.status === "success" ? "Received" : "Line open"}
        </span>
      </div>
      <div className="grid gap-4.5 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <div className="grid gap-1.5">
          <label htmlFor="f-name" className="label-mono">
            Your name *
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            aria-describedby="e-name"
            placeholder="Sara Al-Mansoori"
            className="field"
          />
          <span id="e-name" role="alert" className="min-h-4 text-[12.5px] font-mono text-danger">
            {state.errors.name}
          </span>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="f-email" className="label-mono">
            Work email *
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby="e-email"
            placeholder="you@company.com"
            className="field"
          />
          <span id="e-email" role="alert" className="min-h-4 text-[12.5px] font-mono text-danger">
            {state.errors.email}
          </span>
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="f-topic" className="label-mono">
          What&apos;s this about?
        </label>
        <select
          id="f-topic"
          name="topic"
          defaultValue="Full-time role"
          className="field"
        >
          <option>Full-time role</option>
          <option>Contract / consulting</option>
          <option>Technical advisory</option>
          <option>Something else</option>
        </select>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="f-msg" className="label-mono">
          Message *
        </label>
        <textarea
          id="f-msg"
          name="message"
          rows={5}
          aria-describedby="e-msg"
          placeholder="Role, team size, stack, and what's currently breaking."
          className="field resize-y"
        />
        <span id="e-msg" role="alert" className="min-h-4 text-[12.5px] font-mono text-danger">
          {state.errors.message}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <button
          type="submit"
          disabled={pending}
          className="group relative overflow-hidden inline-flex items-center gap-3 px-6 py-4 rounded-md bg-accent text-on-accent font-bold text-[15.5px] font-semiwide cursor-pointer shadow-[0_4px_0_var(--accent-deep)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-wait"
        >
          {/* Progress sweep while the message is in flight. */}
          <span
            aria-hidden
            className={`absolute inset-y-0 left-0 bg-on-accent/15 ${pending ? "w-full transition-[width] duration-[2.5s] ease-out" : "w-0"}`}
          />
          <span className="relative">{pending ? "Transmitting…" : "Send message"}</span>
          <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <span role="status" className="font-mono text-[12.5px]">
          {state.status === "success" && (
            <span className="text-accent-fg animate-[card-in_.5s_var(--ease-out-expo)_both] inline-block">
              ✓ Signal received — I&apos;ll reply within one business day.
            </span>
          )}
          {state.status === "error" && (
            <span className="text-danger">{state.serverError}</span>
          )}
        </span>
      </div>
    </form>
  );
}
