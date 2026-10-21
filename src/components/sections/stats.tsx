import { stats } from "@/content/home";
import { CountUp } from "@/components/motion/count-up";

/** Four LCD readouts — the system's health panel at the ingress. */
export function Stats() {
  return (
    <div aria-label="Impact by the numbers" role="group" data-reveal-group className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label} data-reveal className="group lcd hover-zoom relative px-4 pt-3.5 pb-4">
          <div className="flex justify-between mb-2.5 font-mono text-[9px] tracking-[0.14em] text-lcd-muted">
            <span>METRIC {String(i + 1).padStart(2, "0")}</span>
            <span aria-hidden className="led !w-1.5 !h-1.5 !shadow-none opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="lcd-text text-[30px] sm:text-[36px] leading-none tracking-[-0.02em]">
            <CountUp value={s.value} />
            <span className="text-accent [text-shadow:0_0_14px_var(--accent)]">{s.suffix}</span>
          </div>
          <div className="mt-2.5 font-mono text-[10px] tracking-[0.04em] uppercase text-lcd-muted max-w-[26ch] text-pretty">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
