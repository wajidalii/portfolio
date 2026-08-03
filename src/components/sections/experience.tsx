import { db } from "@/db/client";
import { roles } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function Experience() {
  const items = await db.query.roles.findMany({
    orderBy: asc(roles.sortOrder),
  });

  if (items.length === 0) return null;

  return (
    <section id="experience" aria-labelledby="exp-h" className="border-b border-border">
      <div className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20 lg:py-26">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent mb-4">
          03 — Experience
        </div>
        <h2
          id="exp-h"
          className="font-display text-[28px] sm:text-4xl lg:text-[42px] font-bold tracking-[-0.03em] mb-3"
        >
          Career timeline
        </h2>
        <p className="text-muted max-w-[60ch] mb-12 text-[16.5px]">
          Roles, scope, and the outcome each one is accountable for.
        </p>
        <ol className="list-none m-0 p-0 grid">
          {items.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-1 min-[880px]:grid-cols-[150px_1fr] gap-4 min-[880px]:gap-7 pb-10"
            >
              <div className="flex min-[880px]:flex-col gap-1.5">
                <span className="font-mono text-[12.5px] text-text">{r.period}</span>
                <span className="font-mono text-[11.5px] text-muted">{r.location}</span>
              </div>
              <div className="relative pl-7 border-l border-border">
                <span
                  aria-hidden
                  className="hidden min-[880px]:block absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-bg border-2 border-accent"
                />
                <h3 className="m-0 mb-1 font-display text-xl font-semibold tracking-[-0.02em]">
                  {r.title}
                </h3>
                <div className="text-muted text-[15px] mb-4">
                  {r.company} · {r.scope}
                </div>
                <ul className="m-0 mb-4 p-0 list-none grid gap-2.5">
                  {r.wins.map((w) => (
                    <li key={w} className="grid grid-cols-[auto_1fr] gap-2.5 text-muted text-[15.5px]">
                      <span aria-hidden className="text-accent-2 font-mono">
                        ▸
                      </span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {r.stack.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-md border border-border font-mono text-[11.5px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
