CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'discovery_scheduled', 'proposal_sent', 'negotiating', 'won', 'lost');--> statement-breakpoint
CREATE TABLE "inquiry_rate_limits" (
	"bucket_key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"payload_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"website" text DEFAULT '' NOT NULL,
	"country" text NOT NULL,
	"service" text NOT NULL,
	"budget" text NOT NULL,
	"timeline" text NOT NULL,
	"description" text NOT NULL,
	"contact_method" text NOT NULL,
	"source" text NOT NULL,
	"consent_version" text NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledgment_consent" boolean DEFAULT false NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"internal_notes" text DEFAULT '' NOT NULL,
	"follow_up_date" text,
	"notification_status" text DEFAULT 'pending' NOT NULL,
	"acknowledgment_status" text DEFAULT 'not_requested' NOT NULL,
	"notification_attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_leads_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE INDEX "inquiry_rate_limits_expiry_idx" ON "inquiry_rate_limits" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "service_leads_created_at_idx" ON "service_leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "service_leads_status_idx" ON "service_leads" USING btree ("status");