import { ContactForm } from "@/components/contact-form";
import { contactLinks, regions } from "@/content/contact";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="con-h" className="border-b border-border bg-surface">
      <div className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20 lg:py-26">
        <div className="grid grid-cols-1 min-[880px]:grid-cols-[0.9fr_1.1fr] gap-8 min-[880px]:gap-16 items-start">
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent mb-4">
              08 — Contact
            </div>
            <h2
              id="con-h"
              className="font-display text-[28px] sm:text-4xl lg:text-[42px] font-bold tracking-[-0.03em] mb-4.5 text-balance"
            >
              Let&apos;s talk about the system you&apos;re trying to scale.
            </h2>
            <p className="text-muted text-[16.5px] max-w-[48ch] mb-7">
              Currently open to senior and staff engineering roles — full-time
              remote, or relocation with sponsorship. I reply to every
              serious message within one business day.
            </p>
            <div className="grid gap-3 mb-7">
              {contactLinks.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener" : undefined}
                  className="flex items-center gap-3.5 px-4 py-3.5 border border-border rounded-[11px] bg-bg text-text hover:border-accent"
                >
                  <span className="font-mono text-[11.5px] text-muted w-16">
                    {c.label}
                  </span>
                  <span className="text-[15px] font-medium">{c.value}</span>
                  <span aria-hidden className="ml-auto text-muted">
                    ↗
                  </span>
                </a>
              ))}
            </div>
            <div className="border border-border rounded-[11px] bg-bg p-4.5">
              <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-3">
                {"// open to work in"}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {regions.map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 rounded-full border border-border bg-surface-2 text-[13px] text-muted"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
