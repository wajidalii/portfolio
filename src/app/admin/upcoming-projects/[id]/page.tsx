import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { upcomingProjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UpcomingProjectForm } from "@/components/admin/upcoming-project-form";
import { updateUpcomingProject } from "../actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditUpcomingProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await db.query.upcomingProjects.findFirst({
    where: eq(upcomingProjects.id, Number(id)),
  });

  if (!item) notFound();

  return (
    <main className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link href="/admin/upcoming-projects" className="font-mono text-xs text-muted">
        ← Upcoming projects
      </Link>
      <h1 className="font-display text-2xl font-bold mt-2 mb-8">Edit upcoming project</h1>
      <UpcomingProjectForm
        action={updateUpcomingProject.bind(null, item.id)}
        initial={item}
      />
    </main>
  );
}
