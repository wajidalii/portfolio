"use server";

import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { CONTACT_SUBMISSIONS_TAG } from "@/db/queries";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteContactSubmission(id: number) {
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/messages");
  revalidateTag(CONTACT_SUBMISSIONS_TAG);
}
