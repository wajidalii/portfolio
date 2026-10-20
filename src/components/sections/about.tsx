import { aboutParagraphs, quickFacts } from "@/content/about";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section
      id="about"
      data-channel="CH·01 ABOUT"
      aria-labelledby="about-h"
      className="border-b border-border"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-30">
        <div className="grid grid-cols-1 min-[960px]:grid-cols-[1fr_380px] gap-12 min-[960px]:gap-18 items-start">
          <div>
            <SectionHeading id="about-h" channel="01" label="About" className="mb-8">
              I build the boring parts well, so the ambitious parts can ship.
            </SectionHeading>
            <div className="grid gap-5 text-muted text-[17px] leading-[1.7] max-w-[64ch]">
              {aboutParagraphs.map((p, i) => (
                <p
                  key={i}
                  data-reveal
                  className="m-0"
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                  {typeof p === "string" ? (
                    p
                  ) : (
                    <>
                      <strong className="text-text font-semibold bg-[linear-gradient(var(--accent),var(--accent))] bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] hover:bg-[length:100%_2px] transition-[background-size] duration-500">
                        {p.bold}
                      </strong>
                      {p.rest}
                    </>
                  )}
                </p>
              ))}
            </div>
          </div>

          <div
            data-reveal
            className="reg-marks border border-border rounded-lg bg-surface px-5 pt-5 pb-3 min-[960px]:sticky min-[960px]:top-24"
          >
            <div className="flex justify-between mb-3">
              <span className="label-mono">{"// spec sheet"}</span>
              <span aria-hidden className="label-mono">
                Rev 2026
              </span>
            </div>
            <dl className="m-0 grid">
              {quickFacts.map((f) => (
                <div
                  key={f.k}
                  className="group grid grid-cols-[64px_1fr] gap-4 py-3 border-b border-dashed border-border last:border-b-0 text-[14.5px] transition-colors hover:bg-surface-2 -mx-2 px-2 rounded"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted pt-0.5 group-hover:text-accent-fg transition-colors">
                    {f.k}
                  </dt>
                  <dd className="m-0 text-right font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
