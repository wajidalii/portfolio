import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db/client";
import { skillGroups } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteSkillGroup, moveSkillGroup } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const groups = await db.query.skillGroups.findMany({
    orderBy: asc(skillGroups.sortOrder),
  });

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="font-mono text-xs text-muted">
            ← Admin
          </Link>
          <h1 className="font-display text-2xl font-bold mt-2">Skill Groups</h1>
        </div>
        <Link
          href="/admin/skills/new"
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-[#08090a] text-sm"
        >
          Add group
        </Link>
      </div>

      <div className="grid gap-3">
        {groups.map((g, i) => (
          <div
            key={g.id}
            className="border border-border rounded-xl bg-surface p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <form action={moveSkillGroup.bind(null, g.id, "up")}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="w-6 h-6 grid place-items-center rounded border border-border text-xs disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
              </form>
              <form action={moveSkillGroup.bind(null, g.id, "down")}>
                <button
                  type="submit"
                  disabled={i === groups.length - 1}
                  className="w-6 h-6 grid place-items-center rounded border border-border text-xs disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </form>
            </div>
            <div className="flex-1">
              <div className="font-semibold">
                {g.glyph} {g.name}
              </div>
              <div className="text-muted text-sm">
                {g.items.length} items · depth: {g.depth}
              </div>
            </div>
            <Link
              href={`/admin/skills/${g.id}`}
              className="font-mono text-xs text-accent-fg"
            >
              Edit
            </Link>
            <form action={deleteSkillGroup.bind(null, g.id)}>
              <button type="submit" className="font-mono text-xs text-red-400">
                Delete
              </button>
            </form>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-muted text-sm">No skill groups yet.</p>
        )}
      </div>
    </main>
  );
}
