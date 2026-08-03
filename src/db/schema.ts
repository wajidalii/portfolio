import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const skillGroups = pgTable("skill_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  glyph: text("glyph").notNull(),
  depth: text("depth").notNull(), // "primary" | "strong" | "working" — free text, admin-entered
  items: jsonb("items").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(), // e.g. "2024 — Present"
  location: text("location").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  scope: text("scope").notNull(),
  wins: jsonb("wins").$type<string[]>().notNull().default([]),
  stack: jsonb("stack").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const upcomingProjectStatus = pgEnum("upcoming_project_status", [
  "planned",
  "in_progress",
]);

export const upcomingProjects = pgTable("upcoming_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: upcomingProjectStatus("status").notNull().default("planned"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  expectedDate: text("expected_date"), // free text, e.g. "Q1 2027" — nullable
  link: text("link"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
