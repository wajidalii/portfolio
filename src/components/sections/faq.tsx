import { faqs } from "@/content/faq";
import { SectionHeading } from "@/components/ui/section-heading";

export function Faq() {
  return (
    <section
      id="faq"
      data-channel="CH·07 FAQ"
      aria-labelledby="faq-h"
      className="border-b border-border bg-surface"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-28 grid grid-cols-1 min-[960px]:grid-cols-[380px_1fr] gap-10 min-[960px]:gap-16 items-start">
        <div className="min-[960px]:sticky min-[960px]:top-24">
          <SectionHeading id="faq-h" channel="07" label="FAQ" size="md" className="mb-5">
            Straight answers for recruiters
          </SectionHeading>
          <p data-reveal className="text-muted m-0 text-[16px]">
            Written to be quotable — short, factual, self-contained.
          </p>
        </div>
        <div data-reveal-group className="grid gap-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              data-reveal
              className="faq hover-zoom group relative border border-border rounded-lg bg-bg open:border-accent"
            >
              <summary className="cursor-pointer list-none flex items-center gap-4 px-5 py-4.5 [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="font-mono text-[11px] text-muted w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semiwide font-semibold text-[16.5px] tracking-[-0.01em]">
                  {f.q}
                </span>
                {/* A dial: the indicator turns as the answer opens. */}
                <span
                  aria-hidden
                  className="relative shrink-0 w-9 h-9 rounded-full border border-border bg-surface-2 shadow-[inset_0_-2px_0_rgba(0,0,0,.25)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-open:rotate-[135deg]"
                >
                  <span className="absolute left-1/2 top-[5px] -ml-px w-[2px] h-[10px] rounded-full bg-accent" />
                </span>
              </summary>
              <p className="m-0 px-5 pb-5 pl-[64px] text-muted text-[15.5px] leading-relaxed max-w-[72ch] text-pretty">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
