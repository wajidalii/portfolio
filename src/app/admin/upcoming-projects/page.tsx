import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db/client";
import { upcomingProjects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/ui/action-form";
import { deleteUpcomingProject, moveUpcomingProject } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminUpcomingProjectsPage() {
  const items = await db.query.upcomingProjects.findMany({
    orderBy: asc(upcomingProjects.sortOrder),
  });

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="font-mono text-xs text-muted">
            ← Admin
          </Link>
          <h1 className="font-display text-2xl font-bold mt-2">Upcoming Projects</h1>
        </div>
        <Button href="/admin/upcoming-projects/new" size="md">
          Add project
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map((p, i) => (
          <div
            key={p.id}
            className="border border-border rounded-xl bg-surface p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <ActionForm action={moveUpcomingProject.bind(null, p.id, "up")}>
                {(pending) => (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="icon"
                    disabled={pending || i === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </Button>
                )}
              </ActionForm>
              <ActionForm action={moveUpcomingProject.bind(null, p.id, "down")}>
                {(pending) => (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="icon"
                    disabled={pending || i === items.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </Button>
                )}
              </ActionForm>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div className="text-muted text-sm">
                {p.status === "in_progress" ? "In progress" : "Planned"}
                {p.expectedDate ? ` · ${p.expectedDate}` : ""}
              </div>
            </div>
            <Button
              href={`/admin/upcoming-projects/${p.id}`}
              variant="secondary"
              size="sm"
            >
              Edit
            </Button>
            <ActionForm
              action={deleteUpcomingProject.bind(null, p.id)}
              successMessage="Upcoming project deleted."
            >
              {(pending) => (
                <Button type="submit" variant="danger" size="sm" disabled={pending}>
                  {pending ? "Deleting…" : "Delete"}
                </Button>
              )}
            </ActionForm>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted text-sm">No upcoming projects yet.</p>
        )}
      </div>
    </main>
  );
}
