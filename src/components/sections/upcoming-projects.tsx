import { getUpcomingProjects } from "@/db/queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/motion/tilt-card";

const STATUS_LABEL: Record<string, string> = {
  planned: "Planned",
  in_progress: "In progress",
};

export async function UpcomingProjects() {
  const items = await getUpcomingProjects();

  return (
    <section
      id="upcoming-projects"
      data-channel="CH·06 WHAT'S NEXT"
      aria-labelledby="upcoming-h"
      className="border-b border-border bg-surface"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-28">
        <div className="flex flex-wrap gap-6 items-end justify-between mb-12">
          <SectionHeading id="upcoming-h" channel="06" label="What's next" size="md">
            Upcoming projects
          </SectionHeading>
          <p data-reveal className="text-muted max-w-[44ch] m-0 text-[16px]">
            What I&apos;m building or planning next — kept current without a redeploy.
          </p>
        </div>

        {items.length === 0 ? (
          <div data-reveal className="lcd px-5 py-6 font-mono text-[13px] text-lcd-muted">
            <span className="text-lcd-fg">NO SIGNAL</span> — nothing queued up publicly right now. Check back soon.
          </div>
        ) : (
          <div
            data-reveal-group
            className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]"
          >
            {items.map((p) => {
              const live = p.status === "in_progress";
              return (
                <div key={p.id} data-reveal>
                  <TiltCard className="group h-full border border-border rounded-lg bg-bg p-5.5 flex flex-col gap-4 hover:border-accent">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="m-0 font-semiwide font-bold text-[18px] tracking-[-0.015em]">
                        {p.title}
                      </h3>
                      <span className="shrink-0 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-fg border border-border rounded-sm px-2 py-1">
                        <span
                          aria-hidden
                          className={`led !w-1.5 !h-1.5 ${live ? "led-blink" : "!bg-muted !shadow-none"}`}
                        />
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </div>
                    <p className="m-0 text-muted text-[14.5px] leading-relaxed text-pretty">
                      {p.description}
                    </p>
                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-1 rounded border border-border bg-surface-2 font-mono text-[10.5px] text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto pt-4 border-t border-dashed border-border flex flex-wrap items-center gap-3 font-mono text-[11.5px] text-muted">
                      {p.expectedDate && <span>ETA {p.expectedDate}</span>}
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener"
                          className="link-sweep ml-auto inline-flex items-center gap-1.5 text-accent-fg"
                        >
                          follow along <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
