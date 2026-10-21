import { getRoles } from "@/db/queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { Playhead } from "@/components/motion/playhead";
import { Station } from "@/components/stage/station";

/** Station 03 · logs — the career as an event stream. */
export async function Experience() {
  const items = await getRoles();

  if (items.length === 0) return null;

  return (
    <Station index={3} side="right" labelledBy="exp-h">
      <SectionHeading id="exp-h" channel="03" label="Experience" size="md" className="mb-5">
        Career timeline
      </SectionHeading>
      <p data-reveal className="text-muted m-0 mb-10 text-[16px]">
        Roles, scope, and the outcome each one is accountable for — newest first.
      </p>

      <Playhead>
        {/* Rail + scroll-driven fill (desktop only). */}
        <div
          aria-hidden
          className="hidden min-[960px]:block absolute left-[139px] top-2 bottom-0 w-[2px] bg-border"
        >
          <div className="playhead-fill absolute inset-0 bg-accent origin-top scale-y-100 shadow-[0_0_12px_var(--accent)]" />
        </div>

        <ol className="list-none m-0 p-0 grid gap-12">
          {items.map((r) => (
            <li
              key={r.id}
              data-reveal
              className="exp-role grid grid-cols-1 min-[960px]:grid-cols-[140px_1fr] gap-3 min-[960px]:gap-12"
            >
              <div className="flex min-[960px]:flex-col gap-x-3 gap-y-1.5 flex-wrap min-[960px]:pr-4">
                <span className="exp-period font-mono text-[12px] uppercase tracking-[0.04em] text-accent-2-fg">
                  {r.period}
                </span>
                <span className="font-mono text-[11px] text-muted">{r.location}</span>
              </div>
              <div className="relative">
                <span
                  aria-hidden
                  className="exp-node hidden min-[960px]:block absolute -left-[55px] top-[7px] w-3.5 h-3.5 rounded-full border-2 border-accent bg-bg"
                />
                <h3 className="m-0 mb-1.5 font-semiwide font-bold text-[21px] sm:text-[24px] tracking-[-0.02em]">
                  {r.title}
                </h3>
                <div className="text-muted text-[15px] mb-5">
                  <span className="text-text font-medium">{r.company}</span> · {r.scope}
                </div>
                <ul className="m-0 mb-5 p-0 list-none grid gap-2.5">
                  {r.wins.map((w) => (
                    <li
                      key={w}
                      className="group grid grid-cols-[auto_1fr] gap-3 text-muted text-[15px] leading-relaxed"
                    >
                      <span
                        aria-hidden
                        className="text-accent-fg font-mono transition-transform duration-300 group-hover:translate-x-1"
                      >
                        ▸
                      </span>
                      <span className="group-hover:text-text transition-colors">{w}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {r.stack.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded border border-border font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent-fg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Playhead>
    </Station>
  );
}
