import { faqs } from "@/content/faq";

export function Faq() {
  return (
    <section aria-labelledby="faq-h" className="border-b border-border">
      <div className="max-w-[860px] mx-auto px-6 py-14 sm:py-16 lg:py-22">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent-fg mb-4">
          07 — FAQ
        </div>
        <h2
          id="faq-h"
          className="font-display text-[26px] sm:text-[32px] lg:text-4xl font-bold tracking-[-0.03em] mb-2.5"
        >
          Straight answers for recruiters
        </h2>
        <p className="text-muted mb-8 text-base">
          Written to be quotable — short, factual, self-contained.
        </p>
        <div className="grid gap-2.5">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="border border-border rounded-xl bg-surface px-5 py-4"
            >
              <summary className="cursor-pointer font-semibold text-base tracking-[-0.01em] list-none flex justify-between gap-4 items-center">
                {f.q}
                <span aria-hidden className="text-accent-fg font-mono">
                  +
                </span>
              </summary>
              <p className="mt-3.5 mb-1 text-muted text-[15.5px] max-w-[70ch] text-pretty">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
