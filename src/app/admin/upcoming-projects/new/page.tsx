import type { Metadata } from "next";
import Link from "next/link";
import { UpcomingProjectForm } from "@/components/admin/upcoming-project-form";
import { createUpcomingProject } from "../actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NewUpcomingProjectPage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link href="/admin/upcoming-projects" className="font-mono text-xs text-muted">
        ← Upcoming projects
      </Link>
      <h1 className="font-display text-2xl font-bold mt-2 mb-8">Add upcoming project</h1>
      <UpcomingProjectForm action={createUpcomingProject} />
    </main>
  );
}
