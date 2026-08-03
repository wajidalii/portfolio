import type { Metadata } from "next";
import Link from "next/link";
import { SkillGroupForm } from "@/components/admin/skill-group-form";
import { createSkillGroup } from "../actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NewSkillGroupPage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link href="/admin/skills" className="font-mono text-xs text-muted">
        ← Skill groups
      </Link>
      <h1 className="font-display text-2xl font-bold mt-2 mb-8">Add skill group</h1>
      <SkillGroupForm action={createSkillGroup} />
    </main>
  );
}
