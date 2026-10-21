import { getUpcomingProjects } from "@/db/queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { Station } from "@/components/stage/station";

const STATUS_LABEL: Record<string, string> = {
  planned: "Planned",
  in_progress: "In progress",
};

/** Station 06 · backlog — what's queued next. */
export async function UpcomingProjects() {
  const items = await getUpcomingProjects();

  return (
    <Station index={6} side="right" width="narrow" labelledBy="upcoming-h">
      <SectionHeading id="upcoming-h" channel="06" label="What's next" size="md" className="mb-5">
        Upcoming projects
      </SectionHeading>
      <p data-reveal className="text-muted m-0 mb-8 text-[16px]">
        What I&apos;m building or planning next — kept current without a redeploy.
      </p>

      {items.length === 0 ? (
        <div data-reveal className="lcd px-5 py-6 font-mono text-[13px] text-lcd-muted">
          <span className="text-lcd-fg">QUEUE EMPTY</span> — nothing queued up publicly right now. Check back soon.
        </div>
      ) : (
        <ol data-reveal-group className="list-none m-0 p-0 grid gap-3">
          {items.map((p, i) => {
            const live = p.status === "in_progress";
            return (
              <li key={p.id} data-reveal className="hover-zoom border border-border rounded-lg bg-bg p-5 flex flex-col gap-3.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="m-0 font-semiwide font-bold text-[17px] tracking-[-0.015em]">
                    <span aria-hidden className="font-mono text-[11px] text-muted mr-2">
                      job-{String(i + 1).padStart(2, "0")}
                    </span>
                    {p.title}
                  </h3>
                  <span className="shrink-0 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-fg border border-border rounded-sm px-2 py-1">
                    <span aria-hidden className={`led !w-1.5 !h-1.5 ${live ? "led-blink" : "!bg-muted !shadow-none"}`} />
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <p className="m-0 text-muted text-[14.5px] leading-relaxed text-pretty">{p.description}</p>
                {(p.tags.length > 0 || p.expectedDate || p.link) && (
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-muted">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2 py-1 rounded border border-border bg-surface-2 text-[10.5px]">
                        {t}
                      </span>
                    ))}
                    {p.expectedDate && <span className="ml-1">ETA {p.expectedDate}</span>}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener" className="link-sweep ml-auto text-accent-fg">
                        follow along ↗
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </Station>
  );
}
