import { quotes, endorsers } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section aria-labelledby="tst-h" className="border-b border-border">
      <div className="max-w-[1180px] mx-auto px-6 py-14 sm:py-16 lg:py-22">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent mb-4">
          05 — Recommendations
        </div>
        <h2
          id="tst-h"
          className="font-display text-[26px] sm:text-[32px] lg:text-4xl font-bold tracking-[-0.03em] mb-9"
        >
          What employers and colleagues say
        </h2>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(330px,1fr))]">
          {quotes.map((q, i) => (
            <figure
              key={i}
              className="m-0 border border-border rounded-2xl bg-surface p-6.5"
            >
              <blockquote className="m-0 mb-5 text-[17px] leading-relaxed tracking-[-0.01em] text-pretty">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid place-items-center w-[38px] h-[38px] rounded-full bg-surface-2 border border-border font-mono text-[12.5px] text-muted"
                >
                  {q.initials}
                </span>
                <span>
                  <span className="block font-semibold text-[14.5px]">{q.name}</span>
                  <span className="block text-muted text-[13.5px]">{q.role}</span>
                </span>
                <a
                  href={q.href}
                  target="_blank"
                  rel="noopener"
                  className="ml-auto font-mono text-xs whitespace-nowrap"
                >
                  {q.hrefLabel} ↗
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-7">
          <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-4.5">
            {"// peer endorsements"}
          </div>
          <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {endorsers.map((e) => (
              <div
                key={e.name}
                className="flex items-start gap-3.5 border border-border rounded-xl bg-surface px-4.5 py-4"
              >
                <span
                  aria-hidden
                  className="grid place-items-center w-[34px] h-[34px] shrink-0 rounded-full bg-surface-2 border border-border font-mono text-[11.5px] text-accent"
                >
                  {e.initials}
                </span>
                <span>
                  <span className="block font-semibold text-[14.5px]">{e.name}</span>
                  <span className="block text-muted text-[13px]">{e.role}</span>
                  <span className="block mt-1.5 text-muted text-[13.5px]">
                    &ldquo;{e.note}&rdquo;
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
