-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('Active', 'Archived');

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "email" TEXT,
    "normalized_email" TEXT,
    "phone_number" TEXT,
    "job_title" TEXT,
    "notes" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContactStatus" NOT NULL DEFAULT 'Active',
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contacts_brand_id_status_updated_at_idx" ON "contacts"("brand_id", "status", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "contacts_brand_id_is_primary_idx" ON "contacts"("brand_id", "is_primary");

-- CreateIndex
CREATE INDEX "contacts_brand_id_normalized_name_idx" ON "contacts"("brand_id", "normalized_name");

-- CreateIndex
CREATE INDEX "contacts_brand_id_normalized_email_idx" ON "contacts"("brand_id", "normalized_email");

-- CreateIndex
CREATE INDEX "contacts_user_id_updated_at_idx" ON "contacts"("user_id", "updated_at" DESC);

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
