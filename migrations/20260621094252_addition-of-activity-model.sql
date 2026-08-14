-- CreateEnum
CREATE TYPE "ActivityEntityType" AS ENUM ('Brand', 'Contact', 'Deal', 'Deliverable', 'Task', 'Invoice', 'Payment', 'File', 'Note');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('BrandCreated', 'BrandUpdated', 'BrandArchived', 'ContactCreated', 'ContactUpdated', 'ContactArchived', 'ContactPrimaryChanged');

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "entity_type" "ActivityEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "brand_id" UUID,
    "contact_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_user_id_created_at_idx" ON "activities"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activities_user_id_brand_id_created_at_idx" ON "activities"("user_id", "brand_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activities_user_entity_created_at_idx" ON "activities"("user_id", "entity_type", "entity_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activities_user_type_created_at_idx" ON "activities"("user_id", "type", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
