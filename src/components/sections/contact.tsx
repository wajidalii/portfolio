import { ContactForm } from "@/components/contact-form";
import { contactLinks, regions } from "@/content/contact";
import { SectionHeading } from "@/components/ui/section-heading";

export function Contact() {
  return (
    <section
      id="contact"
      data-channel="CH·08 CONTACT"
      aria-labelledby="con-h"
      className="border-b border-border"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-30">
        <div className="grid grid-cols-1 min-[960px]:grid-cols-[0.9fr_1.1fr] gap-12 min-[960px]:gap-16 items-start">
          <div>
            <SectionHeading id="con-h" channel="08" label="Contact" className="mb-6">
              Let&apos;s talk about the system you&apos;re trying to scale.
            </SectionHeading>
            <p data-reveal className="text-muted text-[17px] leading-relaxed max-w-[48ch] mb-8">
              Currently open to senior and staff engineering roles — full-time
              remote, or relocation with sponsorship. I reply to every
              serious message within one business day.
            </p>
            <div data-reveal-group className="grid gap-3 mb-8">
              {contactLinks.map((c) => {
                const external = c.href.startsWith("http");
                return (
                  <a
                    key={c.label}
                    data-reveal
                    href={c.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener" : undefined}
                    className="hover-zoom group relative flex items-center gap-4 px-4 py-4 border border-border rounded-md bg-surface text-text shadow-[0_3px_0_var(--border)] hover:border-accent"
                  >
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted w-[72px] group-hover:text-accent-fg transition-colors">
                      {c.label}
                    </span>
                    <span className="text-[15.5px] font-semibold">{c.value}</span>
                    <span
                      aria-hidden
                      className="ml-auto text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-fg"
                    >
                      ↗
                    </span>
                  </a>
                );
              })}
            </div>
            <div data-reveal className="lcd p-4.5">
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-lcd-muted mb-3">
                {"// open to work in"}
              </div>
              <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
                {regions.map((r) => (
                  <li
                    key={r}
                    className="px-2.5 py-1 rounded-sm border border-[#222a32] font-mono text-[11px] text-lcd-fg transition-[transform,background-color,color] duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-on-accent"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
