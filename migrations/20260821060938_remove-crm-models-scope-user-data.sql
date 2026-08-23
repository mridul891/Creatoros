/*
  Warnings:

  - You are about to drop the column `deal_id` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_template_deliverables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_template_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deal_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deal_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deliverables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `integration_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scripts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_user_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_template_deliverables" DROP CONSTRAINT "campaign_template_deliverables_template_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_template_tasks" DROP CONSTRAINT "campaign_template_tasks_template_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_templates" DROP CONSTRAINT "campaign_templates_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "deal_files" DROP CONSTRAINT "deal_files_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "deal_files" DROP CONSTRAINT "deal_files_user_id_fkey";

-- DropForeignKey
ALTER TABLE "deal_notes" DROP CONSTRAINT "deal_notes_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "deal_notes" DROP CONSTRAINT "deal_notes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "deals" DROP CONSTRAINT "deals_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "deals" DROP CONSTRAINT "deals_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "deals" DROP CONSTRAINT "deals_user_id_fkey";

-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_user_id_fkey";

-- DropForeignKey
ALTER TABLE "integration_accounts" DROP CONSTRAINT "integration_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "scripts" DROP CONSTRAINT "scripts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- DropIndex
DROP INDEX "invoices_deal_created_at_idx";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "deal_id";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "brands";

-- DropTable
DROP TABLE "campaign_template_deliverables";

-- DropTable
DROP TABLE "campaign_template_tasks";

-- DropTable
DROP TABLE "campaign_templates";

-- DropTable
DROP TABLE "contacts";

-- DropTable
DROP TABLE "deal_files";

-- DropTable
DROP TABLE "deal_notes";

-- DropTable
DROP TABLE "deals";

-- DropTable
DROP TABLE "deliverables";

-- DropTable
DROP TABLE "integration_accounts";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "scripts";

-- DropTable
DROP TABLE "tasks";

-- DropEnum
DROP TYPE "ActivityEntityType";

-- DropEnum
DROP TYPE "ActivityType";

-- DropEnum
DROP TYPE "ContactStatus";

-- DropEnum
DROP TYPE "DealFileCategory";

-- DropEnum
DROP TYPE "DealFileStatus";

-- DropEnum
DROP TYPE "DealNoteStatus";

-- DropEnum
DROP TYPE "DealPriority";

-- DropEnum
DROP TYPE "DealStage";

-- DropEnum
DROP TYPE "DealStatus";

-- DropEnum
DROP TYPE "DeliverableApprovalStatus";

-- DropEnum
DROP TYPE "DeliverableStatus";

-- DropEnum
DROP TYPE "IntegrationPlatform";

-- DropEnum
DROP TYPE "NotificationStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "TaskPriority";

-- DropEnum
DROP TYPE "TaskStatus";

-- CreateIndex
CREATE INDEX "invoices_user_created_at_idx" ON "invoices"("user_id", "created_at" DESC);
