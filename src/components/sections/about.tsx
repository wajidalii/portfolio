import { aboutParagraphs, quickFacts } from "@/content/about";

export function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="border-b border-border">
      <div className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20 lg:py-26">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent mb-4">
          01 — About
        </div>
        <div className="grid grid-cols-1 min-[880px]:grid-cols-[1fr_0.78fr] gap-8 min-[880px]:gap-18 items-start">
          <div>
            <h2
              id="about-h"
              className="font-display text-[28px] sm:text-4xl lg:text-[42px] font-bold tracking-[-0.03em] leading-[1.1] mb-6 text-balance"
            >
              I build the boring parts well, so the ambitious parts can ship.
            </h2>
            <div className="grid gap-[18px] text-muted text-[16.5px] max-w-[66ch]">
              {aboutParagraphs.map((p, i) =>
                typeof p === "string" ? (
                  <p key={i} className="m-0">
                    {p}
                  </p>
                ) : (
                  <p key={i} className="m-0">
                    <strong className="text-text font-semibold">{p.bold}</strong>
                    {p.rest}
                  </p>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-3.5">
            <div className="border border-border rounded-2xl bg-surface px-5 pt-5 pb-4.5">
              <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-4">
                {"// quick facts"}
              </div>
              <dl className="m-0 grid">
                {quickFacts.map((f) => (
                  <div
                    key={f.k}
                    className="grid grid-cols-[auto_1fr] gap-4 py-2.5 border-b border-border text-[14.5px] last:border-b-0"
                  >
                    <dt className="text-muted font-mono text-[12.5px] pt-0.5">{f.k}</dt>
                    <dd className="m-0 text-right font-medium">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
