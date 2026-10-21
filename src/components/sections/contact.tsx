import { ContactForm } from "@/components/contact-form";
import { BookCallLink } from "@/components/book-call";
import { contactLinks, regions } from "@/content/contact";
import { SectionHeading } from "@/components/ui/section-heading";
import { Station } from "@/components/stage/station";

const LINK_ROW =
  "hover-zoom group relative flex items-center gap-4 px-4 py-4 border border-border rounded-md bg-bg text-text shadow-[0_3px_0_var(--border)] hover:border-accent";

/** Station 08 · inbox — every request ends here. */
export function Contact() {
  return (
    <Station index={8} side="center" width="full" labelledBy="con-h">
      <div className="grid grid-cols-1 min-[960px]:grid-cols-[0.9fr_1.1fr] gap-10 min-[960px]:gap-14 items-start">
        <div>
          <SectionHeading id="con-h" channel="08" label="Contact" className="mb-6">
            Let&apos;s talk about the system you&apos;re trying to scale.
          </SectionHeading>
          <p data-reveal className="text-muted text-[17px] leading-relaxed max-w-[48ch] mb-7">
            Currently open to senior and staff engineering roles — full-time
            remote, or relocation with sponsorship. I reply to every
            serious message within one business day.
          </p>
          <div data-reveal className="mb-8">
            <BookCallLink className="group inline-flex items-center gap-3 px-6 py-4 rounded-md bg-accent text-on-accent font-bold text-[15.5px] font-semiwide shadow-[0_4px_0_var(--accent-deep),0_16px_34px_-16px_var(--accent)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
              <span aria-hidden className="font-mono text-[13px]">◷</span>
              Book a 15-min call
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </BookCallLink>
            <p className="m-0 mt-3 font-mono text-[11px] text-muted">Pick a date and time — opens the scheduler.</p>
          </div>
          <div data-reveal-group className="grid gap-3 mb-8">
            {contactLinks.map((c) => {
              const inner = (
                <>
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
                </>
              );
              if (c.booking) {
                return (
                  <div key={c.label} data-reveal>
                    <BookCallLink className={LINK_ROW}>{inner}</BookCallLink>
                  </div>
                );
              }
              const external = c.href.startsWith("http");
              return (
                <a
                  key={c.label}
                  data-reveal
                  href={c.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener" : undefined}
                  className={LINK_ROW}
                >
                  {inner}
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
                  className="px-2.5 py-1 rounded-sm border border-white/10 font-mono text-[11px] text-lcd-fg transition-[transform,background-color,color] duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-on-accent"
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
    </Station>
  );
}
