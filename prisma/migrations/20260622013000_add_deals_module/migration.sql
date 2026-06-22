-- CreateEnum
CREATE TYPE "DealStage" AS ENUM (
  'Lead',
  'Contacted',
  'Negotiation',
  'ProposalSent',
  'ContractSigned',
  'Active',
  'Delivered',
  'Completed',
  'Paid',
  'Cancelled'
);

-- CreateEnum
CREATE TYPE "DealPriority" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('Active', 'Archived');

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'DealCreated';
ALTER TYPE "ActivityType" ADD VALUE 'DealUpdated';
ALTER TYPE "ActivityType" ADD VALUE 'DealStageChanged';
ALTER TYPE "ActivityType" ADD VALUE 'DealArchived';
ALTER TYPE "ActivityType" ADD VALUE 'DealRestored';

-- AlterTable
ALTER TABLE "activities" ADD COLUMN "deal_id" UUID;

-- CreateTable
CREATE TABLE "deals" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "brand_id" UUID NOT NULL,
  "contact_id" UUID,
  "campaign_name" TEXT NOT NULL,
  "normalized_campaign_name" TEXT NOT NULL,
  "deal_value" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "stage" "DealStage" NOT NULL DEFAULT 'Lead',
  "priority" "DealPriority" NOT NULL DEFAULT 'Medium',
  "status" "DealStatus" NOT NULL DEFAULT 'Active',
  "start_date" TIMESTAMP(3),
  "due_date" TIMESTAMP(3),
  "expected_close_date" TIMESTAMP(3),
  "payment_due_date" TIMESTAMP(3),
  "payment_terms" TEXT,
  "campaign_description" TEXT,
  "deliverables_summary" TEXT,
  "notes" TEXT,
  "source" TEXT,
  "probability" INTEGER,
  "external_ref" TEXT,
  "last_stage_changed_at" TIMESTAMP(3),
  "delivered_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "paid_at" TIMESTAMP(3),
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deals_user_brand_campaign_unique" ON "deals"("user_id", "brand_id", "normalized_campaign_name");

-- CreateIndex
CREATE INDEX "deals_user_status_updated_at_idx" ON "deals"("user_id", "status", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "deals_user_stage_updated_at_idx" ON "deals"("user_id", "stage", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "deals_user_brand_stage_idx" ON "deals"("user_id", "brand_id", "stage");

-- CreateIndex
CREATE INDEX "deals_user_due_date_idx" ON "deals"("user_id", "due_date");

-- CreateIndex
CREATE INDEX "activities_user_id_deal_id_created_at_idx" ON "activities"("user_id", "deal_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "activities"
ADD CONSTRAINT "activities_deal_id_fkey"
FOREIGN KEY ("deal_id")
REFERENCES "deals"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals"
ADD CONSTRAINT "deals_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals"
ADD CONSTRAINT "deals_brand_id_fkey"
FOREIGN KEY ("brand_id")
REFERENCES "brands"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals"
ADD CONSTRAINT "deals_contact_id_fkey"
FOREIGN KEY ("contact_id")
REFERENCES "contacts"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
