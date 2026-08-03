CREATE TYPE "public"."upcoming_project_status" AS ENUM('planned', 'in_progress');--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"location" text NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"scope" text NOT NULL,
	"wins" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"glyph" text NOT NULL,
	"depth" text NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upcoming_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "upcoming_project_status" DEFAULT 'planned' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expected_date" text,
	"link" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
