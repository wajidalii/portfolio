"use server";

import { db } from "@/db/client";
import { upcomingProjects } from "@/db/schema";
import { UPCOMING_PROJECTS_TAG } from "@/db/queries";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readFields(formData: FormData) {
  const status = String(formData.get("status") ?? "planned");
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    status: status === "in_progress" ? ("in_progress" as const) : ("planned" as const),
    tags: parseTags(String(formData.get("tags") ?? "")),
    expectedDate: String(formData.get("expectedDate") ?? "").trim() || null,
    link: String(formData.get("link") ?? "").trim() || null,
  };
}

export async function createUpcomingProject(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.title || !fields.description) return;

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${upcomingProjects.sortOrder}), -1)` })
    .from(upcomingProjects);

  await db.insert(upcomingProjects).values({ ...fields, sortOrder: maxOrder + 1 });

  revalidatePath("/");
  revalidatePath("/admin/upcoming-projects");
  revalidateTag(UPCOMING_PROJECTS_TAG);
  redirect("/admin/upcoming-projects");
}

export async function updateUpcomingProject(id: number, formData: FormData) {
  const fields = readFields(formData);
  if (!fields.title || !fields.description) return;

  await db
    .update(upcomingProjects)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(upcomingProjects.id, id));

  revalidatePath("/");
  revalidatePath("/admin/upcoming-projects");
  revalidateTag(UPCOMING_PROJECTS_TAG);
  redirect("/admin/upcoming-projects");
}

export async function deleteUpcomingProject(id: number) {
  await db.delete(upcomingProjects).where(eq(upcomingProjects.id, id));
  revalidatePath("/");
  revalidatePath("/admin/upcoming-projects");
  revalidateTag(UPCOMING_PROJECTS_TAG);
}

export async function moveUpcomingProject(id: number, direction: "up" | "down") {
  const items = await db.query.upcomingProjects.findMany({
    orderBy: asc(upcomingProjects.sortOrder),
  });
  const index = items.findIndex((p) => p.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];

  await db
    .update(upcomingProjects)
    .set({ sortOrder: swap.sortOrder })
    .where(eq(upcomingProjects.id, current.id));
  await db
    .update(upcomingProjects)
    .set({ sortOrder: current.sortOrder })
    .where(eq(upcomingProjects.id, swap.id));

  revalidatePath("/");
  revalidatePath("/admin/upcoming-projects");
  revalidateTag(UPCOMING_PROJECTS_TAG);
}
