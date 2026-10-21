import { heroStack } from "@/content/home";
import { ProximityType } from "@/components/motion/proximity-type";
import { Magnetic } from "@/components/motion/magnetic";
import { LiveClock } from "@/components/hero/live-clock";
import { StackTicker } from "@/components/hero/stack-ticker";
import { Parallax } from "@/components/motion/parallax";
import { Station } from "@/components/stage/station";
import { BookCallLink } from "@/components/book-call";
import { Stats } from "./stats";

/** Station 00 · ingress — where the request (the visitor) enters the system. */
export function Hero() {
  return (
    <>
      <Station index={0} side="left" width="full" bare labelledBy="hero-h" className="min-[960px]:min-h-[calc(100svh-64px)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 border border-border rounded bg-surface/80 font-mono text-[11.5px] text-muted">
            <span aria-hidden className="led led-blink" />
            Open to senior / staff roles — remote &amp; relocation
          </div>
          <div className="lcd hidden sm:flex items-center gap-4 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-lcd-muted">
            <span>
              DXB <span className="lcd-text text-[13px]"><LiveClock timeZone="Asia/Dubai" /></span>
            </span>
            <span>
              KHI <span className="lcd-text text-[13px]"><LiveClock timeZone="Asia/Karachi" /></span>
            </span>
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

        <div data-reveal style={{ "--reveal-delay": "220ms" } as React.CSSProperties} className="mt-7">
          <p className="text-[17px] sm:text-lg leading-relaxed text-muted max-w-[52ch] mb-9 text-pretty">
            5+ years shipping SaaS platforms end to end — distributed
            backends, multi-tenant architecture, and LLM systems that hold
            up in production. Scroll to trace a request through the system.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Magnetic>
              <BookCallLink className="group inline-flex items-center gap-3 px-6 py-4 rounded-md bg-accent text-on-accent font-bold text-[15.5px] font-semiwide shadow-[0_4px_0_var(--accent-deep),0_16px_34px_-16px_var(--accent)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_0_0_var(--accent-deep)]">
                Book a 15-min call
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </BookCallLink>
            </Magnetic>
            <a
              href="#about"
              className="group inline-flex items-center gap-2.5 px-5 py-4 rounded-md border border-border bg-surface/80 text-text font-semibold text-[15.5px] shadow-[0_3px_0_var(--border)] transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-accent active:translate-y-[3px] active:shadow-none"
            >
              Enter the system
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 max-w-[860px]">
          <Stats />
        </div>
      </Station>
      <div className="relative">
        <StackTicker items={heroStack} />
      </div>
    </>
  );
}
