import { Magnetic } from "@/components/motion/magnetic";

export function CtaBanner() {
  return (
    <section aria-label="Call to action" className="border-b border-border">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-14 sm:py-18">
        <div
          data-reveal
          className="hover-zoom cta-panel group relative overflow-hidden border border-border rounded-lg bg-surface p-8 sm:p-12 lg:p-14 flex flex-wrap gap-8 items-center justify-between"
        >
          {/* Scan line sweeping across the panel. */}
          <span aria-hidden className="cta-scan absolute inset-y-0 -left-1/3 w-1/3 pointer-events-none" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 40px)",
              maskImage: "linear-gradient(90deg,#000,transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="channel mb-4">
              <span aria-hidden className="led led-blink !w-[7px] !h-[7px]" />
              Accepting new signals
            </div>
            <h2 className="m-0 mb-2.5 font-wide font-extrabold text-[26px] sm:text-[34px] lg:text-[42px] leading-[1.02] tracking-[-0.03em] max-w-[22ch] text-balance">
              Hiring for a system that has to hold up?
            </h2>
            <p className="m-0 text-muted text-[16px]">
              One call, no pitch — I&apos;ll tell you honestly whether I&apos;m the right fit.
            </p>
          </div>
          <Magnetic className="relative">
            <a
              href="#contact"
              className="group/btn inline-flex items-center gap-3 px-7 py-4.5 rounded-md bg-accent text-on-accent font-bold text-[16px] font-semiwide whitespace-nowrap shadow-[0_4px_0_var(--accent-deep),0_16px_34px_-16px_var(--accent)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            >
              Book a 20-min call
              <span aria-hidden className="transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
