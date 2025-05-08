CREATE TABLE "stock_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"prefix_code" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "stock_categories_prefix_code_unique" UNIQUE("prefix_code")
);
--> statement-breakpoint
ALTER TABLE "stock_groups" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_groups" ADD COLUMN "default_gst_rate" integer;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "stock_category_id" uuid;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "cgst_rate" integer;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "sgst_rate" integer;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "igst_rate" integer;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "hsn_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_groups" ADD CONSTRAINT "stock_groups_category_id_stock_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."stock_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_stock_category_id_stock_categories_id_fk" FOREIGN KEY ("stock_category_id") REFERENCES "public"."stock_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");