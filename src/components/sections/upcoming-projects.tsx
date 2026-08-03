import { db } from "@/db/client";
import { upcomingProjects } from "@/db/schema";
import { asc } from "drizzle-orm";

const STATUS_LABEL: Record<string, string> = {
  planned: "Planned",
  in_progress: "In progress",
};

export async function UpcomingProjects() {
  const items = await db.query.upcomingProjects.findMany({
    orderBy: asc(upcomingProjects.sortOrder),
  });

  return (
    <section
      id="upcoming-projects"
      aria-labelledby="upcoming-h"
      className="border-b border-border bg-surface"
    >
      <div className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20 lg:py-24">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent-fg mb-4">
          06 — What&apos;s next
        </div>
        <h2
          id="upcoming-h"
          className="font-display text-[26px] sm:text-4xl font-bold tracking-[-0.03em] mb-3"
        >
          Upcoming projects
        </h2>
        <p className="text-muted max-w-[60ch] mb-11 text-[16.5px]">
          What I&apos;m building or planning next, kept current from{" "}
          <span className="font-mono text-[13px]">/admin</span> without a
          redeploy.
        </p>

        {items.length === 0 ? (
          <p className="text-muted text-[15px] font-mono">
            Nothing queued up publicly right now — check back soon.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(290px,1fr))]">
            {items.map((p) => (
              <div
                key={p.id}
                className="border border-border rounded-2xl bg-bg p-5.5 flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="m-0 font-display text-[17px] font-semibold tracking-[-0.015em]">
                    {p.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] text-accent-2-fg border border-border rounded-full px-2 py-0.5">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <p className="m-0 text-muted text-[14.5px] text-pretty">
                  {p.description}
                </p>
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 rounded-md border border-border bg-surface-2 font-mono text-[11.5px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-3.5 border-t border-border flex flex-wrap items-center gap-3 font-mono text-[12px] text-muted">
                  {p.expectedDate && <span>{p.expectedDate}</span>}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener"
                      className="ml-auto inline-flex items-center gap-1.5 text-accent-fg"
                    >
                      follow along <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
