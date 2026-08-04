import type { Metadata } from "next";
import Link from "next/link";
import { getSkillGroups } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { deleteSkillGroup, moveSkillGroup } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  const groups = await getSkillGroups();

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="font-mono text-xs text-muted">
            ← Admin
          </Link>
          <h1 className="font-display text-2xl font-bold mt-2">Skill Groups</h1>
        </div>
        <Button href="/admin/skills/new" size="md">
          Add group
        </Button>
      </div>

      <div className="grid gap-3">
        {groups.map((g, i) => (
          <div
            key={g.id}
            className="border border-border rounded-xl bg-surface p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <form action={moveSkillGroup.bind(null, g.id, "up")}>
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  ↑
                </Button>
              </form>
              <form action={moveSkillGroup.bind(null, g.id, "down")}>
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  disabled={i === groups.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </Button>
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
            <Button href={`/admin/skills/${g.id}`} variant="secondary" size="sm">
              Edit
            </Button>
            <form action={deleteSkillGroup.bind(null, g.id)}>
              <Button type="submit" variant="danger" size="sm">
                Delete
              </Button>
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
