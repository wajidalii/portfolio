import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db/client";
import { upcomingProjects } from "@/db/schema";
import { asc } from "drizzle-orm";
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
        <Link
          href="/admin/upcoming-projects/new"
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-[#08090a] text-sm"
        >
          Add project
        </Link>
      </div>

      <div className="grid gap-3">
        {items.map((p, i) => (
          <div
            key={p.id}
            className="border border-border rounded-xl bg-surface p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <form action={moveUpcomingProject.bind(null, p.id, "up")}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="w-6 h-6 grid place-items-center rounded border border-border text-xs disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
              </form>
              <form action={moveUpcomingProject.bind(null, p.id, "down")}>
                <button
                  type="submit"
                  disabled={i === items.length - 1}
                  className="w-6 h-6 grid place-items-center rounded border border-border text-xs disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </form>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div className="text-muted text-sm">
                {p.status === "in_progress" ? "In progress" : "Planned"}
                {p.expectedDate ? ` · ${p.expectedDate}` : ""}
              </div>
            </div>
            <Link
              href={`/admin/upcoming-projects/${p.id}`}
              className="font-mono text-xs text-accent"
            >
              Edit
            </Link>
            <form action={deleteUpcomingProject.bind(null, p.id)}>
              <button type="submit" className="font-mono text-xs text-red-400">
                Delete
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted text-sm">No upcoming projects yet.</p>
        )}
      </div>
    </main>
  );
}
