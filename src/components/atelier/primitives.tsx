import type { ReactNode } from "react";
import Link from "next/link";

export function Section({ id, eyebrow, title, children, className = "" }: {
  id: string; eyebrow: string; title: string; children: ReactNode; className?: string;
}) {
  return <section id={id} aria-labelledby={`${id}-heading`} className={`atelier-section ${className}`}><div className="atelier-container"><div className="atelier-section-heading"><p className="atelier-eyebrow">{eyebrow}</p><h2 id={`${id}-heading`} className="atelier-title">{title}</h2></div>{children}</div></section>;
}
export function ProjectLink({ href, children, source = "home" }: { href: string; children: ReactNode; source?: string }) {
  return <Link href={href} prefetch={false} className="atelier-text-link" data-conversion="project_case_study_clicked" data-source={source}>{children}<span aria-hidden>↗</span></Link>;
}
