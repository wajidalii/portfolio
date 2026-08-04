import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { skillGroups, roles, upcomingProjects } from "./schema";

// Shared, tag-based read cache in front of Postgres. Both the admin pages
// and the public site sections read through these so a value is fetched
// from the DB once and reused until a mutation in admin/*/actions.ts calls
// revalidateTag for the matching tag below.
//
// Contact submissions are deliberately NOT cached here: they're written by
// the public contact form (a separate action that has no reason to know
// about this cache), and admin wants to see a brand new submission the
// moment it lands, so /admin/messages reads straight from the DB instead.

export const SKILL_GROUPS_TAG = "skill-groups";
export const ROLES_TAG = "roles";
export const UPCOMING_PROJECTS_TAG = "upcoming-projects";

export const getSkillGroups = unstable_cache(
  async () => db.query.skillGroups.findMany({ orderBy: asc(skillGroups.sortOrder) }),
  ["skill-groups"],
  { tags: [SKILL_GROUPS_TAG] },
);

export const getSkillGroup = unstable_cache(
  async (id: number) => db.query.skillGroups.findFirst({ where: eq(skillGroups.id, id) }),
  ["skill-group"],
  { tags: [SKILL_GROUPS_TAG] },
);

export const getRoles = unstable_cache(
  async () => db.query.roles.findMany({ orderBy: asc(roles.sortOrder) }),
  ["roles"],
  { tags: [ROLES_TAG] },
);

export const getRole = unstable_cache(
  async (id: number) => db.query.roles.findFirst({ where: eq(roles.id, id) }),
  ["role"],
  { tags: [ROLES_TAG] },
);

export const getUpcomingProjects = unstable_cache(
  async () => db.query.upcomingProjects.findMany({ orderBy: asc(upcomingProjects.sortOrder) }),
  ["upcoming-projects"],
  { tags: [UPCOMING_PROJECTS_TAG] },
);

export const getUpcomingProject = unstable_cache(
  async (id: number) =>
    db.query.upcomingProjects.findFirst({ where: eq(upcomingProjects.id, id) }),
  ["upcoming-project"],
  { tags: [UPCOMING_PROJECTS_TAG] },
);
