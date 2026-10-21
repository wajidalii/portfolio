import { heroStack, proofPoints } from "@/content/home";
import { ProximityType } from "@/components/motion/proximity-type";
import { Magnetic } from "@/components/motion/magnetic";
import { SignalScope } from "@/components/hero/signal-scope";
import { LiveClock } from "@/components/hero/live-clock";
import { StackTicker } from "@/components/hero/stack-ticker";
import { DotField } from "@/components/hero/dot-field";
import { Parallax } from "@/components/motion/parallax";

export function Hero() {
  return (
    <>
      <section aria-labelledby="hero-h" className="relative overflow-hidden border-b border-border">
        <DotField />
        {/* Soft accent glows drifting behind the name. */}
        <div aria-hidden className="aurora aurora-a -top-[260px] -right-[160px] w-[680px] h-[680px]" />
        <div aria-hidden className="aurora aurora-b top-[35%] -left-[220px] w-[560px] h-[560px]" />

        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-12 sm:pt-16 lg:pt-20 pb-14 sm:pb-18 lg:pb-22">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 border border-border rounded bg-surface font-mono text-[11.5px] text-muted">
              <span aria-hidden className="led led-blink" />
              Open to senior / staff roles — remote &amp; relocation
            </div>
            <div aria-hidden className="hidden md:block label-mono">
              Model WA-5 · Serial 2021—2026
            </div>
          </div>

          <h1 id="hero-h" className="m-0">
            <span
              data-reveal="wipe"
              className="block font-display leading-[0.86] tracking-[-0.035em] whitespace-nowrap text-[clamp(46px,13.2vw,196px)] mb-7 sm:mb-9"
            >
              <Parallax speed={-0.18}>
                <ProximityType text="WAJID ALI." accentLast />
              </Parallax>
            </span>
            <span
              data-reveal
              className="block max-w-[26ch] font-semiwide font-semibold text-[24px] sm:text-[30px] lg:text-[34px] leading-[1.15] tracking-[-0.02em] text-balance"
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              Senior software engineer building{" "}
              <span className="text-accent-fg shimmer">scalable systems</span> and{" "}
              <span className="text-accent-2-fg shimmer shimmer-late">AI-first products</span>.
            </span>
          </h1>

          <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.05fr_0.95fr] gap-10 min-[960px]:gap-14 items-start mt-7">
            <div data-reveal style={{ "--reveal-delay": "220ms" } as React.CSSProperties}>
              <p className="text-[17px] sm:text-lg leading-relaxed text-muted max-w-[56ch] mb-9 text-pretty">
                5+ years shipping SaaS platforms end to end — distributed
                backends, multi-tenant architecture, and LLM systems that hold
                up in production. I own problems from schema to SLO, and I
                write the runbook after.
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Magnetic>
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-md bg-accent text-on-accent font-bold text-[15.5px] font-semiwide shadow-[0_4px_0_var(--accent-deep),0_16px_34px_-16px_var(--accent)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_0_0_var(--accent-deep)]"
                  >
                    Book a 20-min call
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </Magnetic>
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2.5 px-5 py-4 rounded-md border border-border bg-surface text-text font-semibold text-[15.5px] shadow-[0_3px_0_var(--border)] transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-accent active:translate-y-[3px] active:shadow-none"
                >
                  See the work
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
                    ↓
                  </span>
                </a>
              </div>
            </div>

            <aside
              aria-label="Proof points"
              data-reveal
              style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
              className="reg-marks hover-zoom border border-border rounded-lg bg-surface p-5 sm:p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,.7)]"
            >
              <div className="flex justify-between gap-3 mb-3.5">
                <span className="label-mono">{"// signal"}</span>
                <span aria-hidden className="label-mono hidden sm:inline">
                  Input · cursor velocity
                </span>
              </div>
              <SignalScope className="h-[112px] mb-4" />
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div className="lcd px-3 py-2.5">
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-lcd-muted mb-0.5">
                    DXB · UTC+4
                  </div>
                  <div className="text-[20px] sm:text-[22px]">
                    <LiveClock timeZone="Asia/Dubai" />
                  </div>
                </div>
                <div className="lcd px-3 py-2.5">
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-lcd-muted mb-0.5">
                    KHI · UTC+5
                  </div>
                  <div className="text-[20px] sm:text-[22px]">
                    <LiveClock timeZone="Asia/Karachi" />
                  </div>
                </div>
              </div>
              <ul className="list-none m-0 p-0 grid gap-3">
                {proofPoints.map((p, i) => (
                  <li
                    key={p.title}
                    className="group grid grid-cols-[26px_1fr] gap-2.5 py-0.5 transition-transform duration-300 hover:translate-x-1"
                  >
                    <span className="font-mono text-[11px] text-accent-fg pt-[3px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14.5px] leading-snug">
                      <span className="font-semibold">{p.title}.</span>{" "}
                      <span className="text-muted">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-dashed border-border font-mono text-[11px] text-muted">
                Dubai · Karachi · Remote (UTC+4 ±5)
              </div>
            </aside>
          </div>
        </div>
      </section>
      <StackTicker items={heroStack} />
    </>
  );
}
