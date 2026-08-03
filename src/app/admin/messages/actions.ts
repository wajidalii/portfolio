"use server";

import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteContactSubmission(id: number) {
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/messages");
}
