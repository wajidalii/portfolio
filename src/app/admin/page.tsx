import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const sections = [
  {
    href: "/admin/messages",
    title: "Contact Messages",
    description: "Read submissions from the Contact form.",
  },
  {
    href: "/admin/skills",
    title: "Skills & Expertise",
    description: "Edit skill groups shown in the Skills section.",
  },
  {
    href: "/admin/experience",
    title: "Experience / Career Timeline",
    description: "Edit roles shown in the Experience section.",
  },
  {
    href: "/admin/upcoming-projects",
    title: "Upcoming Projects",
    description: "Add, edit, or remove upcoming project entries.",
  },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl font-bold">Admin</h1>
        <form action="/api/admin/logout" method="POST">
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
      <div className="grid gap-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block border border-border rounded-xl bg-surface p-5 hover:border-accent transition-colors"
          >
            <div className="font-semibold">{s.title}</div>
            <div className="text-muted text-sm mt-1">{s.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
