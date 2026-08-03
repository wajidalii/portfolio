import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PERSON } from "@/lib/site-config";
import { heroStack } from "@/content/home";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Scalable Systems & AI-First SaaS`,
    template: `%s | ${PERSON.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "senior software engineer for hire",
    "AI-first SaaS engineer",
    "scalable systems engineer",
    "remote software engineer Gulf",
    "senior backend engineer Pakistan",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Scalable Systems & AI-First SaaS`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Scalable Systems & AI-First SaaS`,
    description: SITE_DESCRIPTION,
  },
};

// Runs before hydration so the stored theme applies on first paint — no
// flash of the wrong theme. Kept inline (not a module) so it blocks paint.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  jobTitle: PERSON.jobTitle,
  url: SITE_URL,
  email: `mailto:${PERSON.email}`,
  sameAs: [PERSON.linkedin, PERSON.github],
  knowsAbout: heroStack,
  knowsLanguage: ["English", "Urdu"],
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
