import { getSkillGroups } from "@/db/queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/motion/tilt-card";

// Depth is free text from /admin; map the known values to a 5-bar meter.
const DEPTH_BARS: Record<string, number> = { primary: 5, strong: 4, working: 3 };

export async function Skills() {
  const groups = await getSkillGroups();

  if (groups.length === 0) return null;

  return (
    <section
      id="skills"
      data-channel="CH·02 SKILLS"
      aria-labelledby="skills-h"
      className="border-b border-border bg-surface"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-30">
        <div className="flex flex-wrap gap-6 items-end justify-between mb-12">
          <SectionHeading id="skills-h" channel="02" label="Skills & expertise" className="max-w-[720px]">
            Depth where it matters, range where it helps.
          </SectionHeading>
          <p data-reveal className="text-muted max-w-[44ch] m-0 text-[16px] leading-relaxed">
            Grouped by domain and metered by depth — so a reviewer (or a
            model) can match a role spec in seconds.
          </p>
        </div>
        <div
          data-reveal-group
          className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))]"
        >
          {groups.map((g, i) => {
            const bars = DEPTH_BARS[g.depth.toLowerCase()] ?? 2;
            return (
              <div key={g.id} data-reveal>
                <TiltCard className="skill-mod group h-full border border-border rounded-lg bg-bg p-5.5 hover:border-accent">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="grid place-items-center w-8 h-8 rounded border border-border bg-surface-2 font-mono text-[13px] text-accent-fg transition-transform duration-500 group-hover:rotate-[360deg]"
                      >
                        {g.glyph}
                      </span>
                      <h3 className="m-0 font-semiwide font-bold text-[17px] tracking-[-0.015em]">
                        {g.name}
                      </h3>
                    </div>
                    <span aria-hidden className="font-mono text-[10px] text-muted">
                      M{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5 mb-6">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="px-2.5 py-1.5 rounded border border-border bg-surface-2 font-mono text-[11.5px] text-text transition-[transform,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent-fg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-border">
                    <span className="label-mono !text-[10px]">Depth · {g.depth}</span>
                    <span
                      role="img"
                      aria-label={`Depth ${bars} of 5`}
                      className="vu flex gap-[3px]"
                    >
                      {Array.from({ length: 5 }, (_, b) => (
                        <span
                          key={b}
                          data-on={b < bars ? "" : undefined}
                          style={{ transitionDelay: `${b * 60}ms` }}
                          className="vu-bar block w-3 h-[7px] rounded-[1px] border border-border bg-surface-2"
                        />
                      ))}
                    </span>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
