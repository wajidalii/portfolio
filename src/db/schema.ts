import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
  boolean,
  index,
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

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

// Qualified services inquiries share the existing PostgreSQL database.
export const leadStatus = pgEnum("lead_status", [
  "new", "contacted", "qualified", "discovery_scheduled", "proposal_sent", "negotiating", "won", "lost",
]);
export const serviceLeads = pgTable("service_leads", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull().unique(),
  payloadHash: text("payload_hash").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  website: text("website").notNull().default(""),
  country: text("country").notNull(),
  service: text("service").notNull(),
  budget: text("budget").notNull(),
  timeline: text("timeline").notNull(),
  description: text("description").notNull(),
  contactMethod: text("contact_method").notNull(),
  source: text("source").notNull(),
  consentVersion: text("consent_version").notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
  acknowledgmentConsent: boolean("acknowledgment_consent").notNull().default(false),
  status: leadStatus("status").notNull().default("new"),
  internalNotes: text("internal_notes").notNull().default(""),
  followUpDate: text("follow_up_date"),
  notificationStatus: text("notification_status").notNull().default("pending"),
  acknowledgmentStatus: text("acknowledgment_status").notNull().default("not_requested"),
  notificationAttempts: integer("notification_attempts").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("service_leads_created_at_idx").on(table.createdAt),
  index("service_leads_status_idx").on(table.status),
]);

export const inquiryRateLimits = pgTable("inquiry_rate_limits", {
  bucketKey: text("bucket_key").primaryKey(),
  count: integer("count").notNull().default(1),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, (table) => [index("inquiry_rate_limits_expiry_idx").on(table.expiresAt)]);
