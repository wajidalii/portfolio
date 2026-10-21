import { faqs } from "@/content/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import { Station } from "@/components/stage/station";

/** Station 07 · docs — the README recruiters actually read. */
export function Faq() {
  return (
    <Station index={7} side="left" labelledBy="faq-h">
      <SectionHeading id="faq-h" channel="07" label="FAQ" size="md" className="mb-5">
        Straight answers for recruiters
      </SectionHeading>
      <p data-reveal className="text-muted m-0 mb-8 text-[16px]">
        Written to be quotable — short, factual, self-contained.
      </p>
      <div data-reveal-group className="grid gap-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            data-reveal
            className="faq group relative border border-border rounded-lg bg-bg open:border-accent transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span aria-hidden className="font-mono text-[11px] text-muted w-6 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-semiwide font-semibold text-[16px] tracking-[-0.01em]">{f.q}</span>
              {/* A dial: the indicator turns as the answer opens. */}
              <span
                aria-hidden
                className="relative shrink-0 w-9 h-9 rounded-full border border-border bg-surface-2 shadow-[inset_0_-2px_0_rgba(0,0,0,.25)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-open:rotate-[135deg]"
              >
                <span className="absolute left-1/2 top-[5px] -ml-px w-[2px] h-[10px] rounded-full bg-accent" />
              </span>
            </summary>
            <p className="m-0 px-5 pb-5 pl-[64px] text-muted text-[15px] leading-relaxed text-pretty">{f.a}</p>
          </details>
        ))}
      </div>
    </Station>
  );
}
