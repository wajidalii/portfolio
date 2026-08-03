import { Button } from "@/components/ui/button";
import { heroStack, proofPoints } from "@/content/home";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-h"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(120% 80% at 70% 0%, #000 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-[220px] -right-[120px] w-[620px] h-[620px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--glow), transparent 65%)",
        }}
      />

      <div className="relative max-w-[1180px] mx-auto px-6 pt-14 sm:pt-20 lg:pt-[116px] pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 min-[880px]:grid-cols-[1.15fr_0.85fr] gap-8 min-[880px]:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 pl-2.5 pr-3 py-1.5 border border-border rounded-full bg-surface font-mono text-xs text-muted mb-6">
              <span
                aria-hidden
                className="w-[7px] h-[7px] rounded-full bg-accent-2"
                style={{ animation: "pulse-dot 2.4s ease-in-out infinite" }}
              />
              Open to senior / staff roles — remote &amp; relocation
            </div>

            <h1
              id="hero-h"
              className="font-display font-bold text-[38px] sm:text-5xl lg:text-[68px] leading-[1.02] tracking-[-0.035em] mb-5 text-balance"
            >
              Senior software engineer building{" "}
              <span className="text-accent">scalable systems</span> and{" "}
              <span className="text-accent-2">AI-first products</span>.
            </h1>

            <p className="text-[17px] sm:text-lg text-muted max-w-[60ch] mb-8 text-pretty">
              4.5+ years shipping SaaS platforms end to end — distributed
              backends, multi-tenant architecture, and LLM systems that hold
              up in production. I own problems from schema to SLO, and I
              write the runbook after.
            </p>

            <div className="flex flex-wrap gap-3 mb-9">
              <Button href="#contact">
                Book a 20-min call <span aria-hidden>→</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {heroStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1.5 rounded-md border border-border bg-surface-2 font-mono text-[12.5px] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <aside
            aria-label="Proof points"
            className="border border-border rounded-2xl bg-surface p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,.6)]"
          >
            <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-5">
              {"// proof points"}
            </div>
            <ul className="list-none m-0 p-0 grid gap-[18px]">
              {proofPoints.map((p) => (
                <li key={p.title} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                  <span
                    aria-hidden
                    className="mt-[7px] w-1.5 h-1.5 rounded-sm bg-accent"
                  />
                  <div>
                    <div className="font-semibold text-[15.5px] tracking-[-0.01em]">
                      {p.title}
                    </div>
                    <div className="text-muted text-[14.5px]">{p.body}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-x-3.5 gap-y-1.5 font-mono text-xs text-muted">
              <span>Dubai · Karachi · Remote (UTC+4 ±5)</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
