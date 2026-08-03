"use client";

import { useState } from "react";
import Image from "next/image";
import { projects, projectFilters, shotSrc, type Project } from "@/content/projects";

function ProjectCard({ project }: { project: Project }) {
  const [shotFailed, setShotFailed] = useState(false);
  const showShot = project.hasShot && !shotFailed;

  return (
    <article className="border border-border rounded-2xl bg-bg overflow-hidden flex flex-col transition-all duration-250 hover:border-accent hover:-translate-y-1">
      <div
        role="img"
        aria-label={project.figureAlt}
        className="relative aspect-video bg-surface-2 border-b border-border grid place-items-center"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--border) 0 1px, transparent 1px 9px)",
        }}
      >
        <div className="grid gap-2 place-items-center p-4 text-center">
          <span
            aria-hidden
            className="grid place-items-center w-11 h-11 rounded-[11px] border border-border bg-bg font-mono text-[13px] text-accent"
          >
            {project.glyph}
          </span>
          <span className="font-mono text-[11.5px] text-muted tracking-[0.04em]">
            {project.figureLabel}
          </span>
        </div>
        {showShot && (
          <Image
            src={shotSrc(project)}
            alt={project.figureAlt}
            fill
            loading="lazy"
            className="absolute inset-0 object-cover object-top"
            onError={() => setShotFailed(true)}
            unoptimized
          />
        )}
      </div>
      <div className="p-5.5 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="m-0 font-display text-[19px] font-semibold tracking-[-0.02em]">
              {project.name}
            </h3>
            <span className="font-mono text-[11px] text-accent-2 border border-border rounded-full px-2 py-0.5">
              {project.kind}
            </span>
          </div>
          <p className="m-0 text-muted text-[15px] text-pretty">{project.problem}</p>
        </div>
        <dl className="m-0 grid gap-2 text-[14.5px]">
          <div className="grid grid-cols-[64px_1fr] gap-3">
            <dt className="font-mono text-[11.5px] text-muted pt-0.5">role</dt>
            <dd className="m-0">{project.role}</dd>
          </div>
          <div className="grid grid-cols-[64px_1fr] gap-3">
            <dt className="font-mono text-[11.5px] text-muted pt-0.5">outcome</dt>
            <dd className="m-0 text-text">
              <strong className="font-semibold">{project.outcome}</strong>
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-md border border-border bg-surface-2 font-mono text-[11.5px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-4 font-mono text-[12.5px]">
          <a
            href={project.href}
            target={project.href.startsWith("http") ? "_blank" : undefined}
            rel={project.href.startsWith("http") ? "noopener" : undefined}
            className="inline-flex items-center gap-1.5"
          >
            {project.hrefLabel} <span aria-hidden>↗</span>
          </a>
          <a href="#contact" className="inline-flex items-center gap-1.5 text-muted">
            case study <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.tag === filter);

  return (
    <section id="projects" aria-labelledby="proj-h" className="border-b border-border bg-surface">
      <div className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20 lg:py-26">
        <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-accent mb-4">
          04 — Selected work
        </div>
        <div className="flex flex-wrap gap-5 items-end justify-between mb-11">
          <div>
            <h2
              id="proj-h"
              className="font-display text-[28px] sm:text-4xl lg:text-[42px] font-bold tracking-[-0.03em] mb-3"
            >
              Projects &amp; case studies
            </h2>
            <p className="text-muted max-w-[58ch] m-0 text-[16.5px]">
              Every card is problem → role → stack → outcome, with links to
              the live product and a deeper write-up where one exists.
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {projectFilters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`px-3.5 py-2 rounded-lg border font-mono text-[12.5px] transition-colors ${
                    active
                      ? "bg-accent text-[#08090a] border-accent"
                      : "bg-bg text-muted border-border hover:border-accent"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(330px,1fr))]">
          {visible.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
