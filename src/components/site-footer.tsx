import Link from "next/link";
import { PERSON } from "@/lib/site-config";

const SITE_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Selected work" },
  { href: "/about", label: "About & experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-container">
        <div className="atelier-footer-grid">
          <div className="atelier-footer-brand">
            <Link prefetch={false} href="/" className="atelier-brand"><span aria-hidden="true" className="atelier-brand-symbol">w<span>.</span></span><span>Wajid Ali</span></Link>
            <p>Thoughtful software.<br />Built for real business needs.</p>
            <a href="/services?source=footer#inquiry" className="atelier-text-link" data-conversion="proposal_requested" data-source="footer">Start a Project <span aria-hidden="true">↗</span></a>
          </div>
          <nav aria-label="Footer — site" className="atelier-footer-links">
            <h2>Explore</h2>
            {SITE_LINKS.map((link) => <Link prefetch={false} href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
          <nav aria-label="Footer — connect" className="atelier-footer-links">
            <h2>Connect</h2>
            <a href={PERSON.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={PERSON.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={`mailto:${PERSON.email}`}>Email me <span aria-hidden="true">↗</span></a>
            <span className="atelier-footer-recruiter">Hiring an engineer? <Link prefetch={false} href="/about#experience">View experience</Link></span>
          </nav>
        </div>
        <div className="atelier-footer-bottom"><span>© {new Date().getFullYear()} Wajid Ali</span><span>Designed with care. Engineered for purpose.</span><Link prefetch={false} href="/privacy">Privacy</Link></div>
      </div>
    </footer>
  );
}
