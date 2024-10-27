ALTER TABLE "subscriptions" RENAME COLUMN "plan_type" TO "planType";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "planType" SET DATA TYPE plan;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "planType" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE subs_status;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" DROP NOT NULL;