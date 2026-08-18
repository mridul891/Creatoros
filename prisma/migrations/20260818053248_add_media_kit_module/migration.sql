-- CreateEnum
CREATE TYPE "MediaKitCategory" AS ENUM ('fashion', 'beauty', 'fitness', 'gaming', 'technology', 'lifestyle', 'travel', 'food', 'business', 'other');

-- CreateEnum
CREATE TYPE "MediaKitCurrency" AS ENUM ('USD', 'EUR', 'GBP', 'INR');

-- CreateTable
CREATE TABLE "scripts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_kits" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "category" "MediaKitCategory" NOT NULL,
    "bio" TEXT,
    "avatar_url" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "avg_reel_views" INTEGER NOT NULL DEFAULT 0,
    "avg_likes" INTEGER NOT NULL DEFAULT 0,
    "avg_comments" INTEGER NOT NULL DEFAULT 0,
    "avg_story_views" INTEGER NOT NULL DEFAULT 0,
    "engagement_rate" DECIMAL(5,2) NOT NULL,
    "top_age_groups" TEXT NOT NULL,
    "women_percentage" DECIMAL(5,2) NOT NULL,
    "cities" TEXT[],
    "countries" TEXT[],
    "brands_worked_with" TEXT,
    "currency" "MediaKitCurrency" NOT NULL DEFAULT 'INR',
    "rate_per_thousand" DECIMAL(12,2) NOT NULL,
    "payment_terms" TEXT NOT NULL,
    "add_ons" JSONB NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "contact_website" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_kit_work_items" (
    "id" UUID NOT NULL,
    "media_kit_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_kit_work_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_kit_rate_deliverables" (
    "id" UUID NOT NULL,
    "media_kit_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_kit_rate_deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_kits_user_id_key" ON "media_kits"("user_id");

-- CreateIndex
CREATE INDEX "media_kits_user_updated_at_idx" ON "media_kits"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "media_kit_work_items_kit_order_idx" ON "media_kit_work_items"("media_kit_id", "order_index");

-- CreateIndex
CREATE INDEX "media_kit_rate_deliverables_kit_order_idx" ON "media_kit_rate_deliverables"("media_kit_id", "order_index");

-- AddForeignKey
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_kits" ADD CONSTRAINT "media_kits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_kit_work_items" ADD CONSTRAINT "media_kit_work_items_media_kit_id_fkey" FOREIGN KEY ("media_kit_id") REFERENCES "media_kits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_kit_rate_deliverables" ADD CONSTRAINT "media_kit_rate_deliverables_media_kit_id_fkey" FOREIGN KEY ("media_kit_id") REFERENCES "media_kits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
