import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db/client";
import { roles } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteRole, moveRole } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const items = await db.query.roles.findMany({
    orderBy: asc(roles.sortOrder),
  });

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="font-mono text-xs text-muted">
            ← Admin
          </Link>
          <h1 className="font-display text-2xl font-bold mt-2">Experience</h1>
        </div>
        <Link
          href="/admin/experience/new"
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-[#08090a] text-sm"
        >
          Add role
        </Link>
      </div>

      <div className="grid gap-3">
        {items.map((r, i) => (
          <div
            key={r.id}
            className="border border-border rounded-xl bg-surface p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <form action={moveRole.bind(null, r.id, "up")}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="w-6 h-6 grid place-items-center rounded border border-border text-xs disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
              </form>
              <form action={moveRole.bind(null, r.id, "down")}>
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
              <div className="font-semibold">
                {r.title} — {r.company}
              </div>
              <div className="text-muted text-sm">{r.period}</div>
            </div>
            <Link href={`/admin/experience/${r.id}`} className="font-mono text-xs text-accent-fg">
              Edit
            </Link>
            <form action={deleteRole.bind(null, r.id)}>
              <button type="submit" className="font-mono text-xs text-red-400">
                Delete
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted text-sm">No roles yet.</p>}
      </div>
    </main>
  );
}
