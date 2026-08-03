import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { skillGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SkillGroupForm } from "@/components/admin/skill-group-form";
import { updateSkillGroup } from "../actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditSkillGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = await db.query.skillGroups.findFirst({
    where: eq(skillGroups.id, Number(id)),
  });

  if (!group) notFound();

  return (
    <main className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link href="/admin/skills" className="font-mono text-xs text-muted">
        ← Skill groups
      </Link>
      <h1 className="font-display text-2xl font-bold mt-2 mb-8">Edit skill group</h1>
      <SkillGroupForm
        action={updateSkillGroup.bind(null, group.id)}
        initial={group}
      />
    </main>
  );
}
