import type { Metadata } from "next";
import { Manrope, Inter, Martian_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PERSON } from "@/lib/site-config";
import { heroStack } from "@/content/home";

const manrope = Manrope({ variable: "--font-manrope", weight: "600", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  weight: "400",
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Software Engineering, SaaS & Websites`,
    template: `%s | ${PERSON.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "senior software engineer for hire",
    "AI-first SaaS engineer",
    "scalable systems engineer",
    "custom SaaS development",
    "website performance and automation",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  alternates: {
    canonical: "/",
  },
  // Renders <meta name="websitelaunches-verification" content="…"> in <head>.
  verification: {
    other: {
      "websitelaunches-verification": "f599e617fe2c5e170ec61394cce87758",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Software Engineering, SaaS & Websites`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Software Engineering, SaaS & Websites`,
    description: SITE_DESCRIPTION,
  },
};

// Runs before hydration so the stored theme applies on first paint — no
// flash of the wrong theme. Kept inline (not a module) so it blocks paint.
const themeInitScript = `
(function () {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem("theme");
    root.setAttribute("data-theme", stored === "light" || stored === "dark" ? stored : "dark");
  } catch (e) {
    root.setAttribute("data-theme", "dark");
  }
})();
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
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
        className={`${manrope.variable} ${inter.variable} ${martianMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
