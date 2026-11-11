"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { validateInquiry, sourceOptions, serviceOptions, type InquiryErrors } from "@/lib/leads/validation";
import { trackConversion } from "@/lib/services/analytics";

const services = [["website", "Website design / performance"], ["saas", "Custom SaaS / business software"], ["automation", "AI automation / integration"], ["not-sure", "Help me choose"]];
const budgets = [["under-45000", "Below PKR 45,000"], ["45000-95000", "PKR 45,000–95,000"], ["95000-175000", "PKR 95,000–175,000"], ["175000-plus", "PKR 175,000+"], ["discuss", "Let’s discuss scope first"]];
const timelines = [["asap", "As soon as practical"], ["1-3-months", "Within 1–3 months"], ["3-plus-months", "3+ months"], ["flexible", "Flexible / exploring"]];

export function InquiryForm({ acknowledgmentAvailable = false }: { acknowledgmentAvailable?: boolean }) {
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const submissionId = useRef("");
  const source = useRef("services");
  const busy = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    setReady(true);
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service") ?? "";
    const selectedSource = params.get("source") ?? service;
    if ((sourceOptions as readonly string[]).includes(selectedSource)) source.current = selectedSource;
    if ((serviceOptions as readonly string[]).includes(service)) {
      const select = form.current?.elements.namedItem("service") as HTMLSelectElement | null;
      if (select) select.value = service;
    }
    if (params.get("contact") === "consultation") {
      const select = form.current?.elements.namedItem("contactMethod") as HTMLSelectElement | null;
      if (select) select.value = "consultation";
    }
  }, []);

  const showError = (next: InquiryErrors, text: string) => {
    setErrors(next); setMessage(text);
    requestAnimationFrame(() => summary.current?.focus());
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current || success) return;
    const values = new FormData(event.currentTarget);
    submissionId.current ||= crypto.randomUUID();
    const input = Object.fromEntries(values);
    const raw = { ...input, consent: values.get("consent") === "on", acknowledgmentConsent: values.get("acknowledgmentConsent") === "on", submissionId: submissionId.current, source: source.current };
    const result = validateInquiry(raw);
    if (!result.data) { showError(result.errors, "Please check the highlighted fields."); return; }
    busy.current = true; setPending(true); setErrors({}); setMessage("");
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(raw) });
      const body = await response.json();
      if (!response.ok || body.ok !== true) {
        showError(body.errors ?? {}, body.message ?? "Please try again or email me directly."); return;
      }
      setSuccess(true); setMessage(body.message);
      trackConversion("inquiry_submitted_successfully", source.current);
      requestAnimationFrame(() => summary.current?.focus());
    } catch { showError({}, "The connection was interrupted. Try again safely, or email wajidalii.me@gmail.com."); }
    finally { busy.current = false; setPending(false); }
  };
  const error = (name: keyof InquiryErrors) => errors[name] ? <span id={`inquiry-${name}-error`} className="text-danger text-sm">{errors[name]}</span> : null;
  const attributes = (name: keyof InquiryErrors) => ({ id: `inquiry-${name}`, name, "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `inquiry-${name}-error` : undefined });
  const textField = (name: "fullName" | "email" | "company" | "country" | "website", label: string, maxLength: number, autoComplete: string, optional = false) => <div className="grid gap-2 min-w-0"><label htmlFor={`inquiry-${name}`} className="font-semibold text-sm">{label}{!optional && " *"}</label><input {...attributes(name)} className="field w-full min-w-0" maxLength={maxLength} autoComplete={autoComplete} type={name === "email" ? "email" : name === "website" ? "url" : "text"} required={!optional} />{error(name)}</div>;
  const selectField = (name: "service" | "budget" | "timeline", label: string, options: string[][]) => <div className="grid gap-2 min-w-0"><label htmlFor={`inquiry-${name}`} className="font-semibold text-sm">{label} *</label><select {...attributes(name)} className="field w-full min-w-0" defaultValue="" required><option value="" disabled>Select an option</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>{error(name)}</div>;

  return <div className="border border-border rounded-xl bg-surface p-5 sm:p-8 min-w-0">
    <div ref={summary} tabIndex={-1} role={message && !success ? "alert" : "status"} aria-live="polite" className={message ? "mb-6 rounded-lg border border-border p-4 focus:outline-2 focus:outline-accent" : "sr-only"}>
      {message && <p className="m-0 font-medium">{message}</p>}
      {!!Object.keys(errors).length && <ul className="mt-3 list-disc pl-5">{Object.entries(errors).map(([key, text]) => <li key={key}><a href={`#inquiry-${key}`} className="underline">{text}</a></li>)}</ul>}
    </div>
    {success ? <div><h3 className="text-2xl font-bold">Thank you. Let’s find the right next step.</h3><p className="text-muted mt-3">Your inquiry is saved. I’ll review it and reply by email. If you requested a consultation, we’ll agree a suitable 20-minute time together.</p><a className="inline-flex min-h-11 items-center underline mt-4" href="/services">Back to services</a></div> : <form ref={form} action="/api/inquiries" method="POST" onSubmit={submit} noValidate aria-busy={pending} onFocusCapture={() => { if (!started.current) { started.current = true; trackConversion("inquiry_started", source.current); } }}>
      <p className="text-muted text-sm mb-6">A short brief is enough to start. Fields marked * are required. Please don’t include passwords, customer records or confidential documents.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {textField("fullName", "Full name", 100, "name")}
        {textField("email", "Business email", 254, "email")}
        {textField("company", "Company or project name", 150, "organization")}
        {textField("country", "Country", 100, "country-name")}
        {selectField("service", "Service required", services)}
        {selectField("budget", "Estimated project budget", budgets)}
        {selectField("timeline", "Desired timeline", timelines)}
        <div className="grid gap-2 min-w-0"><label htmlFor="inquiry-contactMethod" className="font-semibold text-sm">Preferred contact method *</label><select {...attributes("contactMethod")} className="field w-full min-w-0" defaultValue="email"><option value="email">Email</option><option value="consultation">Arrange a consultation by email</option></select>{error("contactMethod")}</div>
      </div>
      <div className="grid gap-2 mt-5"><label htmlFor="inquiry-description" className="font-semibold text-sm">What are you trying to achieve? *</label><textarea {...attributes("description")} required minLength={20} maxLength={5000} rows={5} className="field w-full" placeholder="Tell me the business problem, who will use the solution, and what a successful result would look like." />{error("description")}<p className="text-muted text-xs">20–5,000 characters. Scope, dependencies and timelines are confirmed after discovery.</p></div>
      <details className="my-5 border-y border-border py-4"><summary className="cursor-pointer font-semibold min-h-11 flex items-center">Add an existing website (optional)</summary><div className="pt-3">{textField("website", "Website URL", 500, "url", true)}</div></details>
      <div className="absolute -left-[10000px] w-px h-px overflow-hidden" aria-hidden="true"><label htmlFor="inquiry-websiteConfirmation">Leave this field empty</label><input id="inquiry-websiteConfirmation" name="websiteConfirmation" tabIndex={-1} autoComplete="off" defaultValue="" /></div>
      <label className="flex gap-3 items-start text-sm leading-relaxed py-3"><input {...attributes("consent")} type="checkbox" required className="mt-1 w-5 h-5 shrink-0 accent-[var(--accent)]" /><span>I agree that Wajid Ali may process these details to respond to my inquiry. Read the <a href="/privacy" className="underline">privacy notice</a>. This is not marketing consent. *</span></label>{error("consent")}
      {acknowledgmentAvailable && <label className="flex gap-3 items-start text-sm py-3"><input name="acknowledgmentConsent" type="checkbox" className="mt-1 w-5 h-5 shrink-0" /><span>Also email me a receipt confirming my inquiry was received (optional).</span></label>}
      <button type="submit" disabled={!ready || pending} className="mt-5 min-h-12 w-full sm:w-auto px-7 py-3 rounded-md bg-accent text-on-accent font-bold disabled:opacity-60 disabled:cursor-wait">{pending ? "Saving your inquiry…" : "Send my project inquiry"}</button>
      <p className="text-muted text-xs mt-4">No payment required. Submitting an inquiry does not commit you to a project.</p>
      <noscript><p className="border border-border p-4">This secure inquiry form needs JavaScript. <a className="underline" href="mailto:wajidalii.me@gmail.com?subject=Project%20inquiry">Email your project brief instead</a>.</p></noscript>
    </form>}
    <p className="text-sm text-muted mt-6">Prefer email? <a className="underline text-accent-fg break-all" href="mailto:wajidalii.me@gmail.com">wajidalii.me@gmail.com</a></p>
  </div>;
}
