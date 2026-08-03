import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section aria-label="Call to action" className="border-b border-border">
      <div className="max-w-[1180px] mx-auto px-6 py-12 sm:py-16 lg:py-20">
        <div
          className="relative overflow-hidden border border-border rounded-[18px] bg-surface p-7 sm:p-10 lg:p-13 flex flex-wrap gap-6.5 items-center justify-between"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 40px)",
              maskImage: "linear-gradient(90deg,#000,transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="m-0 mb-2 font-display text-[22px] sm:text-2xl lg:text-[32px] font-bold tracking-[-0.03em]">
              Hiring for a system that has to hold up?
            </h2>
            <p className="m-0 text-muted text-base">
              One call, no pitch — I&apos;ll tell you honestly whether I&apos;m the right fit.
            </p>
          </div>
          <Button href="#contact" className="relative whitespace-nowrap">
            Book a 20-min call <span aria-hidden>→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
