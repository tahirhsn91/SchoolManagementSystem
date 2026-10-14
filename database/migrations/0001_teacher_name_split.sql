ALTER TABLE "teachers" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "last_name" text;--> statement-breakpoint
UPDATE "teachers" SET
	"first_name" = split_part("full_name", ' ', 1),
	"last_name" = btrim(substr("full_name", length(split_part("full_name", ' ', 1)) + 1));--> statement-breakpoint
UPDATE "teachers" SET "first_name" = 'Unknown' WHERE "first_name" IS NULL OR "first_name" = '';--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "full_name";
