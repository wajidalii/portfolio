const SITE_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
];

const ELSEWHERE_LINKS = [
  { href: "https://www.linkedin.com/in/wajid-alii/", label: "LinkedIn ↗" },
  { href: "https://github.com/wajidalii", label: "GitHub ↗" },
];

const REGIONS =
  "UAE · Saudi Arabia · Qatar · Kuwait · Oman · Bahrain · Pakistan · USA · UK · Malaysia";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface">
      <div className="max-w-[1180px] mx-auto px-6 py-13 grid gap-9 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <div>
          <div className="flex items-center gap-2.5 font-display font-bold text-base mb-3.5">
            <span className="grid place-items-center w-[26px] h-[26px] rounded-md bg-gradient-to-br from-accent to-accent-2 text-[#08090a] text-[11px]">
              WA
            </span>
            Wajid Ali
          </div>
          <p className="text-muted text-[14.5px] max-w-[30ch] m-0">
            Senior software engineer — scalable systems, SaaS platforms,
            AI-first products.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span className="w-[7px] h-[7px] rounded-full bg-accent-2" />{" "}
            Available from Sept 2026
          </div>
        </div>

        <nav aria-label="Footer — site">
          <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-3.5">
            Site
          </div>
          <div className="grid gap-2.5 text-[14.5px]">
            {SITE_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-text hover:text-accent">
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <nav aria-label="Footer — elsewhere">
          <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-3.5">
            Elsewhere
          </div>
          <div className="grid gap-2.5 text-[14.5px]">
            {ELSEWHERE_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="text-text hover:text-accent"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <div>
          <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted mb-3.5">
            Open to
          </div>
          <p className="text-muted text-[14.5px] max-w-[30ch] m-0">{REGIONS}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1180px] mx-auto px-6 py-4.5 flex flex-wrap gap-3 justify-between font-mono text-[11.5px] text-muted">
          <span>© {year} Wajid Ali — built from scratch, no template.</span>
        </div>
      </div>
    </footer>
  );
}
