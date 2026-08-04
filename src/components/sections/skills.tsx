import { getSkillGroups } from "@/db/queries";

export async function Skills() {
  const groups = await getSkillGroups();

  if (groups.length === 0) return null;

  return (
    <section id="skills" aria-labelledby="skills-h" className="border-b border-border bg-surface">
      <div className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20 lg:py-26">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent-fg mb-4">
          02 — Skills &amp; expertise
        </div>
        <h2
          id="skills-h"
          className="font-display text-[28px] sm:text-4xl lg:text-[42px] font-bold tracking-[-0.03em] mb-3"
        >
          Depth where it matters, range where it helps.
        </h2>
        <p className="text-muted max-w-[62ch] mb-11 text-[16.5px]">
          Each entity below is a discrete, labelled skill — grouped by domain
          and marked by depth so a reviewer (or a model) can match a role
          spec in seconds.
        </p>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(290px,1fr))]">
          {groups.map((g) => (
            <div
              key={g.id}
              className="border border-border rounded-2xl bg-bg p-5.5 transition-colors hover:border-accent"
            >
              <div className="flex items-center gap-2.5 mb-4.5">
                <span
                  aria-hidden
                  className="grid place-items-center w-7 h-7 rounded-lg border border-border bg-surface-2 font-mono text-xs text-accent-fg"
                >
                  {g.glyph}
                </span>
                <h3 className="m-0 font-display text-[17px] font-semibold tracking-[-0.015em]">
                  {g.name}
                </h3>
              </div>
              <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="px-2.5 py-1 rounded-md border border-border bg-surface-2 font-mono text-[12.5px] text-text"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-mono text-xs text-muted">
                depth: {g.depth}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
