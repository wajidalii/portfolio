import { aboutParagraphs, quickFacts } from "@/content/about";
import { proofPoints } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";
import { Station } from "@/components/stage/station";

/** Station 01 · gateway — who's on the other end of the request. */
export function About() {
  return (
    <Station index={1} side="right" labelledBy="about-h">
      <SectionHeading id="about-h" channel="01" label="About" size="md" className="mb-7">
        I build the boring parts well, so the ambitious parts can ship.
      </SectionHeading>
      <div className="grid gap-4 text-muted text-[16.5px] leading-[1.7] mb-9">
        {aboutParagraphs.map((p, i) => (
          <p
            key={i}
            data-reveal
            className="m-0"
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
          >
            {typeof p === "string" ? (
              p
            ) : (
              <>
                <strong className="text-text font-semibold bg-[linear-gradient(var(--accent),var(--accent))] bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] hover:bg-[length:100%_2px] transition-[background-size] duration-500">
                  {p.bold}
                </strong>
                {p.rest}
              </>
            )}
          </p>
        ))}
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <div data-reveal className="reg-marks rounded-lg border border-border bg-bg px-4 pt-4 pb-2">
          <div className="flex justify-between mb-2">
            <span className="label-mono">{"// spec sheet"}</span>
            <span aria-hidden className="label-mono">
              Rev 2026
            </span>
          </div>
          <dl className="m-0 grid">
            {quickFacts.map((f) => (
              <div
                key={f.k}
                className="group grid grid-cols-[56px_1fr] gap-3 py-2.5 border-b border-dashed border-border last:border-b-0 text-[14px] transition-colors hover:bg-surface-2 -mx-2 px-2 rounded"
              >
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted pt-0.5 group-hover:text-accent-fg transition-colors">
                  {f.k}
                </dt>
                <dd className="m-0 text-right font-semibold">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul data-reveal className="list-none m-0 p-0 grid gap-3.5 content-start">
          {proofPoints.map((p, i) => (
            <li key={p.title} className="grid grid-cols-[24px_1fr] gap-2 transition-transform duration-300 hover:translate-x-1">
              <span className="font-mono text-[11px] text-accent-fg pt-[3px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[14.5px] leading-snug">
                <span className="font-semibold">{p.title}.</span> <span className="text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Station>
  );
}
