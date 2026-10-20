const SITE_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const ELSEWHERE_LINKS = [
  { href: "https://www.linkedin.com/in/wajid-alii/", label: "LinkedIn" },
  { href: "https://github.com/wajidalii", label: "GitHub" },
];

const REGIONS =
  "UAE · Saudi Arabia · Qatar · Kuwait · Oman · Bahrain · Pakistan · USA · UK · Malaysia";

/** Footer = the instrument's back plate: serial plate, ports, giant wordmark. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-surface border-t border-border">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div className="reg-marks border border-border rounded-lg bg-bg p-5 self-start">
            <div className="label-mono mb-3">Serial plate</div>
            <dl className="m-0 grid gap-1.5 font-mono text-[11.5px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">MODEL</dt>
                <dd className="m-0">WA-4.5 Senior Engineer</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ORIGIN</dt>
                <dd className="m-0">KHI · DXB · Remote</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">BUILD</dt>
                <dd className="m-0">From scratch, no template</dd>
              </div>
              <div className="flex justify-between gap-4 items-center">
                <dt className="text-muted">STATUS</dt>
                <dd className="m-0 inline-flex items-center gap-2">
                  <span className="led led-blink !w-[7px] !h-[7px]" aria-hidden />
                  Available from Sept 2026
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Footer — site">
            <div className="label-mono mb-4">Site</div>
            <ul className="list-none m-0 p-0 grid gap-2.5 text-[15px]">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-text hover:text-accent-fg transition-colors"
                  >
                    <span className="inline-block w-0 h-px bg-accent transition-[width] duration-300 group-hover:w-4" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — elsewhere">
            <div className="label-mono mb-4">Elsewhere</div>
            <ul className="list-none m-0 p-0 grid gap-2.5 text-[15px]">
              {ELSEWHERE_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="group inline-flex items-center gap-2 text-text hover:text-accent-fg transition-colors"
                  >
                    <span className="inline-block w-0 h-px bg-accent transition-[width] duration-300 group-hover:w-4" />
                    {l.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="label-mono mb-4">Open to</div>
            <p className="text-muted text-[14.5px] leading-relaxed m-0 max-w-[34ch]">{REGIONS}</p>
            <a
              href="#main"
              className="mt-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-border bg-bg font-mono text-[11.5px] text-text shadow-[0_2px_0_var(--border)] hover:border-accent hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              data-cursor="REWIND"
            >
              <span aria-hidden>⏮</span> Rewind to top
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark — outlined, fills with orange from the left on hover. */}
      <div aria-hidden className="footer-mark max-w-[1240px] mx-auto px-5 sm:px-8 select-none">
        <div className="font-wide font-black leading-[0.8] tracking-[-0.04em] text-[17vw] lg:text-[208px] whitespace-nowrap">
          WAJID ALI
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap gap-3 justify-between font-mono text-[11px] text-muted">
          <span>© {year} Wajid Ali</span>
          <span>Field Instrument · rev {year}</span>
        </div>
      </div>
    </footer>
  );
}
