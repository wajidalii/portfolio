"use server";

import { db } from "@/db/client";
import { skillGroups } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ItemActionState } from "@/components/ui/action-form";

export type FormActionState = { ok: boolean; error?: string };

function parseItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createSkillGroup(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const glyph = String(formData.get("glyph") ?? "").trim();
  const depth = String(formData.get("depth") ?? "primary").trim();
  const items = parseItems(String(formData.get("items") ?? ""));

  if (!name || !glyph) {
    return { ok: false, error: "Name and glyph are required." };
  }

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
  redirect(`/admin/skills?flash=${encodeURIComponent("Skill group added.")}`);
}

export async function updateSkillGroup(
  id: number,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const glyph = String(formData.get("glyph") ?? "").trim();
  const depth = String(formData.get("depth") ?? "primary").trim();
  const items = parseItems(String(formData.get("items") ?? ""));

  if (!name || !glyph) {
    return { ok: false, error: "Name and glyph are required." };
  }

  await db
    .update(skillGroups)
    .set({ name, glyph, depth, items, updatedAt: new Date() })
    .where(eq(skillGroups.id, id));

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect(`/admin/skills?flash=${encodeURIComponent("Skill group saved.")}`);
}

export async function deleteSkillGroup(
  id: number,
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    await db.delete(skillGroups).where(eq(skillGroups.id, id));
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't delete that skill group.", ts: Date.now() };
  }
}

export async function moveSkillGroup(
  id: number,
  direction: "up" | "down",
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    const groups = await db.query.skillGroups.findMany({
      orderBy: asc(skillGroups.sortOrder),
    });
    const index = groups.findIndex((g) => g.id === id);
    if (index === -1) return { ok: false, error: "Skill group not found.", ts: Date.now() };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= groups.length) return { ok: true, ts: Date.now() };

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
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't reorder skill groups.", ts: Date.now() };
  }
}
