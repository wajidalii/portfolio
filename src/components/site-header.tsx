"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];
const PROJECT_LINK = "/services?source=header#inquiry";

/** Native modal semantics provide focus containment and an inert background. */
export function SiteHeader() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    dialogRef.current?.close();
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 960px)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        dialogRef.current?.close();
        setMenuOpen(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  function active(href: string) {
    return !href.includes("#") && (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  }

  return (
    <header className="atelier-header">
      <nav aria-label="Primary" className="atelier-nav">
        <Link href="/" prefetch={false} className="atelier-brand" aria-label="Wajid Ali Software Engineer — Home">
          <span aria-hidden="true" className="atelier-brand-symbol">w<span>.</span></span>
          <span>Wajid Ali<span className="atelier-brand-role">Software Engineer</span></span>
        </Link>
        <div className="atelier-nav-links">
          {NAV_LINKS.map((link) => <Link key={link.href} prefetch={false} href={link.href} aria-current={active(link.href) ? "page" : undefined} className="atelier-nav-link">{link.label}</Link>)}
        </div>
        <div className="atelier-header-actions">
          <ThemeToggle />
          <a className="atelier-header-cta atelier-button atelier-button-primary" href={PROJECT_LINK} data-conversion="proposal_requested" data-source="header">Start a Project <span aria-hidden="true">↗</span></a>
          <button
            ref={triggerRef}
            type="button"
            className="atelier-icon-button atelier-menu-trigger"
            aria-label="Open menu"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => {
              dialogRef.current?.showModal();
              setMenuOpen(true);
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </nav>
      <noscript><nav className="atelier-nojs-nav" aria-label="Quick links">{NAV_LINKS.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}<a href={PROJECT_LINK}>Start a Project</a></nav></noscript>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        className="atelier-mobile-dialog"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),[tabindex="0"]',
          )).filter(node => node.getClientRects().length > 0);
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first?.focus();
          }
        }}
        onCancel={(event) => { event.preventDefault(); closeMenu(); }}
        onClose={() => {
          setMenuOpen(false);
          if (triggerRef.current?.getClientRects().length) triggerRef.current.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="atelier-mobile-panel">
          <div className="atelier-mobile-heading">
            <span id="mobile-navigation-title">Navigation</span>
            <button type="button" autoFocus className="atelier-icon-button" aria-label="Close menu" onClick={closeMenu}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="atelier-mobile-links">
            {NAV_LINKS.map((link) => <Link key={link.href} prefetch={false} href={link.href} onClick={closeMenu} aria-current={active(link.href) ? "page" : undefined}>{link.label}<span aria-hidden="true">↗</span></Link>)}
          </nav>
          <a href={PROJECT_LINK} onClick={closeMenu} className="atelier-button atelier-button-primary" data-conversion="proposal_requested" data-source="header">Start a Project <span aria-hidden="true">↗</span></a>
          <p className="atelier-mobile-note">Websites, software, and thoughtful engineering.</p>
        </div>
      </dialog>
    </header>
  );
}
