import { quotes, endorsers } from "@/content/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/motion/tilt-card";
import { Loupe } from "@/components/motion/loupe";

export function Testimonials() {
  const letter = quotes[0];

  return (
    <section
      id="recommendations"
      data-channel="CH·05 RECOMMENDATIONS"
      aria-labelledby="tst-h"
      className="border-b border-border"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.1fr_0.9fr] gap-12 min-[960px]:gap-16 items-start">
          <div>
            <SectionHeading id="tst-h" channel="05" label="Recommendations" size="md" className="mb-10">
              What employers and colleagues say
            </SectionHeading>
            <div data-reveal-group className="grid gap-4">
              {quotes.map((q, i) => (
                <figure
                  key={i}
                  data-reveal
                  className="hover-zoom relative m-0 border border-border rounded-lg bg-surface p-6 sm:p-7"
                >
                  <span
                    aria-hidden
                    className="absolute -top-3 left-6 px-2 bg-bg font-wide font-black text-[34px] leading-none text-accent-fg"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="m-0 mb-5 text-[18px] sm:text-[20px] leading-[1.45] font-medium tracking-[-0.01em] text-pretty">
                    {q.text}
                  </blockquote>
                  <figcaption className="flex flex-wrap items-center gap-3">
                    <span
                      aria-hidden
                      className="grid place-items-center w-[38px] h-[38px] rounded border border-border bg-surface-2 font-mono text-[12px] text-accent-fg"
                    >
                      {q.initials}
                    </span>
                    <span>
                      <span className="block font-semibold text-[14.5px]">{q.name}</span>
                      <span className="block text-muted text-[13px]">{q.role}</span>
                    </span>
                    <a
                      href={q.href}
                      target="_blank"
                      rel="noopener"
                      className="link-sweep ml-auto font-mono text-[11.5px] text-accent-fg whitespace-nowrap"
                    >
                      {q.hrefLabel} ↗
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div data-reveal className="min-[960px]:sticky min-[960px]:top-24">
            <div className="flex justify-between mb-3">
              <span className="label-mono">{"// exhibit A"}</span>
              <span className="label-mono">28 Sep 2025</span>
            </div>
            <Loupe
              src={letter.href}
              alt="Bin Delamah Contracting Co. appreciation letter for Wajid Ali, dated 28 September 2025"
              width={1290}
              height={1816}
              href={letter.href}
            />
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <div className="label-mono mb-6">{"// peer endorsements"}</div>
          <div
            data-reveal-group
            className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]"
          >
            {endorsers.map((e) => (
              <div key={e.name} data-reveal>
                <TiltCard className="h-full flex flex-col gap-4 border border-border rounded-lg bg-surface p-5.5 hover:border-accent">
                  <p className="m-0 text-muted text-[15px] leading-relaxed text-pretty">
                    &ldquo;{e.note}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-dashed border-border">
                    <span
                      aria-hidden
                      className="grid place-items-center w-[34px] h-[34px] shrink-0 rounded-full border border-border bg-surface-2 font-mono text-[11px] text-accent-fg"
                    >
                      {e.initials}
                    </span>
                    <span>
                      <span className="block font-semibold text-[14.5px]">{e.name}</span>
                      <span className="block text-muted text-[12.5px]">{e.role}</span>
                    </span>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
