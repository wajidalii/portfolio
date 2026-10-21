import { stats } from "@/content/home";
import { CountUp } from "@/components/motion/count-up";

export function Stats() {
  return (
    <section aria-label="Impact by the numbers" className="border-b border-border bg-surface">
      <div
        data-reveal-group
        className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10 sm:py-12 grid gap-3.5 sm:gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            className="group lcd hover-zoom relative px-4 sm:px-5 pt-4 pb-4.5"
          >
            <div className="flex justify-between mb-3 font-mono text-[9px] tracking-[0.14em] text-lcd-muted">
              <span>READOUT {String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden className="led !w-1.5 !h-1.5 !shadow-none opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="lcd-text text-[34px] sm:text-[42px] lg:text-[48px] leading-none tracking-[-0.02em]">
              <CountUp value={s.value} />
              <span className="text-accent [text-shadow:0_0_14px_var(--accent)]">{s.suffix}</span>
            </div>
            <div className="mt-3 font-mono text-[10.5px] tracking-[0.04em] uppercase text-lcd-muted max-w-[26ch] text-pretty">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
