"use client";

import { useState } from "react";
import Image from "next/image";
import { projects, projectFilters, shotSrc, type Project } from "@/content/projects";
import { TiltCard } from "@/components/motion/tilt-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SystemView } from "@/components/three/system-view";
import { Station } from "@/components/stage/station";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [shotFailed, setShotFailed] = useState(false);
  const showShot = project.hasShot && !shotFailed;
  const external = project.href.startsWith("http");

  return (
    <TiltCard
      as="article"
      max={5}
      className="project-card group h-full border border-border rounded-lg bg-bg overflow-hidden flex flex-col hover:border-accent"
    >
      <div
        role="img"
        aria-label={project.figureAlt}
        className="relative aspect-[16/10] bg-surface-2 border-b border-border overflow-hidden"
      >
        <div
          className="project-shot absolute inset-0 grid place-items-center"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--border) 0 1px, transparent 1px 10px)",
          }}
        >
          {project.scene ? (
            <>
              <SystemView preset={project.scene} className="absolute inset-0 w-full h-full" />
              <span className="absolute left-3 right-3 bottom-2.5 font-mono text-[10px] text-muted tracking-[0.04em] text-center">
                {project.figureLabel}
              </span>
            </>
          ) : (
            <div className="grid gap-2.5 place-items-center p-4 text-center">
              <span
                aria-hidden
                className="grid place-items-center w-12 h-12 rounded-md border border-border bg-bg font-mono text-[18px] text-accent-fg"
              >
                {project.glyph}
              </span>
              <span className="font-mono text-[10.5px] text-muted tracking-[0.04em] max-w-[30ch]">
                {project.figureLabel}
              </span>
            </div>
          )}
          {showShot && (
            <Image
              src={shotSrc(project)}
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover object-top"
              onError={() => setShotFailed(true)}
              unoptimized
            />
          )}
        </div>
        {/* Viewfinder chrome */}
        <span aria-hidden className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm bg-lcd/80 font-mono text-[9.5px] tracking-[0.12em] text-lcd-fg">
          <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:animate-[led-blink_1s_steps(2,jump-none)_infinite]" />
          REC {String(index + 1).padStart(2, "0")}
        </span>
        <span aria-hidden className="viewfinder absolute inset-3 pointer-events-none" />
      </div>

      <div className="p-5.5 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <h3 className="m-0 font-semiwide font-bold text-[21px] tracking-[-0.02em]">
              {project.name}
            </h3>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] text-accent-2-fg border border-border rounded-sm px-2 py-1">
              {project.kind}
            </span>
          </div>
          <p className="m-0 text-muted text-[15px] leading-relaxed text-pretty">{project.problem}</p>
        </div>
        <dl className="m-0 grid gap-2.5 text-[14.5px]">
          <div className="grid grid-cols-[68px_1fr] gap-3">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted pt-1">role</dt>
            <dd className="m-0">{project.role}</dd>
          </div>
          <div className="grid grid-cols-[68px_1fr] gap-3">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-accent-fg pt-1">outcome</dt>
            <dd className="m-0 font-semibold">{project.outcome}</dd>
          </div>
        </dl>
        {project.highlights && (
          <ul className="m-0 pl-4 grid gap-1.5 text-[14px] leading-snug text-muted list-disc marker:text-accent-fg">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded border border-border bg-surface-2 font-mono text-[10.5px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-dashed border-border flex flex-wrap gap-4 justify-between font-mono text-[12px]">
          <a
            href={project.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener" : undefined}
            className="link-sweep inline-flex items-center gap-1.5 text-accent-fg"
          >
            {project.hrefLabel} <span aria-hidden>↗</span>
          </a>
          <a href="#contact" className="group/cs inline-flex items-center gap-1.5 text-muted hover:text-text transition-colors">
            case study
            <span aria-hidden className="transition-transform duration-300 group-hover/cs:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </TiltCard>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.tag === filter);
  const activeIndex = projectFilters.indexOf(filter);

  return (
    <Station index={4} side="center" width="full" bare labelledBy="proj-h">
      <div className="station-panel flex flex-wrap gap-6 items-end justify-between mb-8">
        <div className="max-w-[640px]">
          <SectionHeading id="proj-h" channel="04" label="Selected work" size="md" className="mb-5">
            Projects &amp; case studies
          </SectionHeading>
          <p data-reveal className="text-muted max-w-[58ch] m-0 text-[16px] leading-relaxed">
            Each deployment is problem → role → stack → outcome, with links
            to the live product where one exists.
          </p>
        </div>

        {/* Segmented LCD selector with a sliding indicator. */}
        <div role="group" aria-label="Filter projects" className="lcd relative grid grid-cols-4 p-1">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 left-1 rounded-[4px] bg-accent shadow-[0_0_14px_-2px_var(--accent)] transition-transform duration-400 ease-[var(--ease-spring)]"
            style={{
              width: `calc((100% - 8px) / ${projectFilters.length})`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />
          {projectFilters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`relative z-10 px-3.5 sm:px-4 py-2.5 rounded-[4px] font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 ${
                  active ? "text-on-accent font-semibold" : "text-lcd-muted hover:text-lcd-fg"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))]">
        {visible.map((p, i) => (
          <div
            key={`${filter}-${p.name}`}
            className="animate-[card-in_.6s_var(--ease-out-expo)_both]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProjectCard project={p} index={projects.indexOf(p)} />
          </div>
        ))}
      </div>
    </Station>
  );
}
