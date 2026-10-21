import { quotes, endorsers } from "@/content/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { Loupe } from "@/components/motion/loupe";
import { Station } from "@/components/stage/station";

/** Station 05 · monitor — external health checks: what others report. */
export function Testimonials() {
  const letter = quotes[0];

  return (
    <Station index={5} side="left" labelledBy="tst-h">
      <SectionHeading id="tst-h" channel="05" label="Recommendations" size="md" className="mb-8">
        What employers and colleagues say
      </SectionHeading>

      <div data-reveal-group className="grid gap-4 mb-10">
        {quotes.map((q, i) => (
          <figure key={i} data-reveal className="relative m-0 border border-border rounded-lg bg-bg p-6">
            <span
              aria-hidden
              className="absolute -top-3 left-6 px-2 bg-bg font-wide font-black text-[34px] leading-none text-accent-fg"
            >
              &ldquo;
            </span>
            <blockquote className="m-0 mb-5 text-[17px] sm:text-[19px] leading-[1.45] font-medium tracking-[-0.01em] text-pretty">
              {q.text}
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden
                className="grid place-items-center w-[38px] h-[38px] rounded border border-border bg-surface-2 font-mono text-[12px] text-accent-fg"
              >
                {q.initials}
              </span>
              <span>
                <span className="block font-semibold text-[14.5px]">{q.name}</span>
                <span className="block text-muted text-[13px]">{q.role}</span>
              </span>
              <a
                href={q.href}
                target="_blank"
                rel="noopener"
                className="link-sweep ml-auto font-mono text-[11.5px] text-accent-fg whitespace-nowrap"
              >
                {q.hrefLabel} ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-[260px_1fr] items-start">
        <div data-reveal>
          <div className="flex justify-between mb-3">
            <span className="label-mono">{"// exhibit A"}</span>
            <span className="label-mono">28 Sep 2025</span>
          </div>
          <Loupe
            src={letter.href}
            alt="Bin Delamah Contracting Co. appreciation letter for Wajid Ali, dated 28 September 2025"
            width={1290}
            height={1816}
            href={letter.href}
          />
        </div>
        <div>
          <div className="label-mono mb-3">{"// peer endorsements"}</div>
          <div data-reveal-group className="grid gap-3">
            {endorsers.map((e) => (
              <div key={e.name} data-reveal className="hover-zoom border border-border rounded-lg bg-bg p-4.5">
                <p className="m-0 mb-3.5 text-muted text-[14.5px] leading-relaxed text-pretty">&ldquo;{e.note}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid place-items-center w-[30px] h-[30px] shrink-0 rounded-full border border-border bg-surface-2 font-mono text-[10.5px] text-accent-fg"
                  >
                    {e.initials}
                  </span>
                  <span>
                    <span className="block font-semibold text-[14px]">{e.name}</span>
                    <span className="block text-muted text-[12.5px]">{e.role}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Station>
  );
}
