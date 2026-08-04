"use server";

import { db } from "@/db/client";
import { skillGroups } from "@/db/schema";
import { SKILL_GROUPS_TAG } from "@/db/queries";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function parseItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createSkillGroup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const glyph = String(formData.get("glyph") ?? "").trim();
  const depth = String(formData.get("depth") ?? "primary").trim();
  const items = parseItems(String(formData.get("items") ?? ""));

  if (!name || !glyph) return;

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${skillGroups.sortOrder}), -1)` })
    .from(skillGroups);

  await db.insert(skillGroups).values({
    name,
    glyph,
    depth,
    items,
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
  revalidateTag(SKILL_GROUPS_TAG);
  redirect("/admin/skills");
}

export async function updateSkillGroup(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const glyph = String(formData.get("glyph") ?? "").trim();
  const depth = String(formData.get("depth") ?? "primary").trim();
  const items = parseItems(String(formData.get("items") ?? ""));

  if (!name || !glyph) return;

  await db
    .update(skillGroups)
    .set({ name, glyph, depth, items, updatedAt: new Date() })
    .where(eq(skillGroups.id, id));

  revalidatePath("/");
  revalidatePath("/admin/skills");
  revalidateTag(SKILL_GROUPS_TAG);
  redirect("/admin/skills");
}

export async function deleteSkillGroup(id: number) {
  await db.delete(skillGroups).where(eq(skillGroups.id, id));
  revalidatePath("/");
  revalidatePath("/admin/skills");
  revalidateTag(SKILL_GROUPS_TAG);
}

export async function moveSkillGroup(id: number, direction: "up" | "down") {
  const groups = await db.query.skillGroups.findMany({
    orderBy: asc(skillGroups.sortOrder),
  });
  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= groups.length) return;

  const current = groups[index];
  const swap = groups[swapIndex];

  await db
    .update(skillGroups)
    .set({ sortOrder: swap.sortOrder })
    .where(eq(skillGroups.id, current.id));
  await db
    .update(skillGroups)
    .set({ sortOrder: current.sortOrder })
    .where(eq(skillGroups.id, swap.id));

  revalidatePath("/");
  revalidatePath("/admin/skills");
  revalidateTag(SKILL_GROUPS_TAG);
}
