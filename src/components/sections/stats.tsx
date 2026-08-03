import { stats } from "@/content/home";

export function Stats() {
  return (
    <section
      aria-label="Impact by the numbers"
      className="border-b border-border bg-surface"
    >
      <div className="max-w-[1180px] mx-auto px-6 py-9 sm:py-11 lg:py-14 grid gap-7 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-[32px] sm:text-4xl lg:text-[44px] font-bold tracking-[-0.04em] leading-none">
              {s.value}
              <span className="text-accent-fg">{s.suffix}</span>
            </div>
            <div className="mt-2.5 text-muted text-[14.5px] max-w-[24ch] text-pretty">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
