-- Create enums
CREATE TYPE "DeliverableStatus" AS ENUM ('Draft', 'Ready', 'Submitted', 'NeedsRevision', 'Approved', 'Published');
CREATE TYPE "DeliverableApprovalStatus" AS ENUM ('NotSubmitted', 'Pending', 'ChangesRequested', 'Approved');
CREATE TYPE "DealNoteStatus" AS ENUM ('Active', 'Archived');
CREATE TYPE "DealFileCategory" AS ENUM ('Contract', 'CampaignBrief', 'Asset', 'RawMedia', 'FinalDeliverable', 'Invoice', 'Reference');
CREATE TYPE "DealFileStatus" AS ENUM ('Active', 'Archived');
CREATE TYPE "InvoiceStatus" AS ENUM ('Draft', 'Sent', 'Paid', 'Overdue', 'Archived');
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Received', 'Failed');
CREATE TYPE "NotificationStatus" AS ENUM ('Unread', 'Read', 'Archived');
CREATE TYPE "IntegrationPlatform" AS ENUM ('Instagram', 'YouTube');

-- Extend activity enum for system-generated workspace events
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DeliverableCreated';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DeliverableUpdated';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DeliverableSubmitted';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DeliverableApproved';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DeliverablePublished';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DeliverableNeedsRevision';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'NoteAdded';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'NotePinned';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'FileUploaded';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'FileRenamed';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'FileArchived';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'InvoiceGenerated';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'PaymentReceived';

CREATE TABLE "deliverables" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "deal_id" UUID NOT NULL,
  "platform" TEXT NOT NULL,
  "deliverable_type" TEXT NOT NULL,
  "normalized_deliverable_type" TEXT NOT NULL,
  "due_date" TIMESTAMP(3),
  "status" "DeliverableStatus" NOT NULL DEFAULT 'Draft',
  "approval_status" "DeliverableApprovalStatus" NOT NULL DEFAULT 'NotSubmitted',
  "submission_url" TEXT,
  "published_url" TEXT,
  "internal_notes" TEXT,
  "brand_notes" TEXT,
  "revision_count" INTEGER NOT NULL DEFAULT 0,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "is_archived" BOOLEAN NOT NULL DEFAULT false,
  "archived_at" TIMESTAMP(3),
  "created_by" UUID NOT NULL,
  "updated_by" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "deal_notes" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "deal_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "is_pinned" BOOLEAN NOT NULL DEFAULT false,
  "status" "DealNoteStatus" NOT NULL DEFAULT 'Active',
  "created_by" UUID NOT NULL,
  "updated_by" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "archived_at" TIMESTAMP(3),
  CONSTRAINT "deal_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "deal_files" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "deal_id" UUID NOT NULL,
  "file_name" TEXT NOT NULL,
  "storage_path" TEXT NOT NULL,
  "mime_type" TEXT,
  "size_bytes" BIGINT,
  "category" "DealFileCategory" NOT NULL,
  "status" "DealFileStatus" NOT NULL DEFAULT 'Active',
  "metadata" JSONB,
  "uploaded_by" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "archived_at" TIMESTAMP(3),
  CONSTRAINT "deal_files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "campaign_templates" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "normalized_name" TEXT NOT NULL,
  "description" TEXT,
  "is_system" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "campaign_templates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "campaign_template_tasks" (
  "id" UUID NOT NULL,
  "template_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "priority" "TaskPriority" NOT NULL DEFAULT 'Medium',
  "due_offset_days" INTEGER NOT NULL DEFAULT 0,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "campaign_template_tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "campaign_template_deliverables" (
  "id" UUID NOT NULL,
  "template_id" UUID NOT NULL,
  "platform" TEXT NOT NULL,
  "deliverable_type" TEXT NOT NULL,
  "due_offset_days" INTEGER NOT NULL DEFAULT 0,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "campaign_template_deliverables_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invoices" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "deal_id" UUID,
  "invoice_number" TEXT NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'Draft',
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "due_date" TIMESTAMP(3),
  "paid_date" TIMESTAMP(3),
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "invoice_id" UUID,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
  "received_at" TIMESTAMP(3),
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'Unread',
  "entity_type" "ActivityEntityType" NOT NULL,
  "entity_id" TEXT NOT NULL,
  "deal_id" UUID,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "integration_accounts" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "platform" "IntegrationPlatform" NOT NULL,
  "external_account_id" TEXT NOT NULL,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_synced_at" TIMESTAMP(3),
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "integration_accounts_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "deliverables_deal_archived_order_idx" ON "deliverables"("deal_id", "is_archived", "order_index");
CREATE INDEX "deliverables_deal_status_archived_idx" ON "deliverables"("deal_id", "status", "is_archived");
CREATE INDEX "deliverables_deal_due_date_archived_idx" ON "deliverables"("deal_id", "due_date", "is_archived");
CREATE INDEX "deliverables_user_updated_at_idx" ON "deliverables"("user_id", "updated_at" DESC);
CREATE INDEX "deal_notes_deal_status_pinned_updated_idx" ON "deal_notes"("deal_id", "status", "is_pinned", "updated_at" DESC);
CREATE INDEX "deal_notes_user_updated_at_idx" ON "deal_notes"("user_id", "updated_at" DESC);
CREATE INDEX "deal_files_deal_status_category_updated_idx" ON "deal_files"("deal_id", "status", "category", "updated_at" DESC);
CREATE INDEX "deal_files_user_updated_at_idx" ON "deal_files"("user_id", "updated_at" DESC);
CREATE UNIQUE INDEX "campaign_templates_user_normalized_name_key" ON "campaign_templates"("user_id", "normalized_name");
CREATE INDEX "campaign_templates_user_updated_at_idx" ON "campaign_templates"("user_id", "updated_at" DESC);
CREATE INDEX "campaign_template_tasks_template_order_idx" ON "campaign_template_tasks"("template_id", "order_index");
CREATE INDEX "campaign_template_deliverables_template_order_idx" ON "campaign_template_deliverables"("template_id", "order_index");
CREATE INDEX "invoices_user_status_due_date_idx" ON "invoices"("user_id", "status", "due_date");
CREATE INDEX "invoices_deal_created_at_idx" ON "invoices"("deal_id", "created_at" DESC);
CREATE INDEX "payments_user_status_created_at_idx" ON "payments"("user_id", "status", "created_at" DESC);
CREATE INDEX "payments_invoice_created_at_idx" ON "payments"("invoice_id", "created_at" DESC);
CREATE INDEX "notifications_user_status_created_at_idx" ON "notifications"("user_id", "status", "created_at" DESC);
CREATE INDEX "notifications_user_deal_created_at_idx" ON "notifications"("user_id", "deal_id", "created_at" DESC);
CREATE UNIQUE INDEX "integration_accounts_user_platform_external_key" ON "integration_accounts"("user_id", "platform", "external_account_id");
CREATE INDEX "integration_accounts_user_platform_idx" ON "integration_accounts"("user_id", "platform");

-- FKs
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deal_notes" ADD CONSTRAINT "deal_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deal_notes" ADD CONSTRAINT "deal_notes_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deal_files" ADD CONSTRAINT "deal_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deal_files" ADD CONSTRAINT "deal_files_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_templates" ADD CONSTRAINT "campaign_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_template_tasks" ADD CONSTRAINT "campaign_template_tasks_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "campaign_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_template_deliverables" ADD CONSTRAINT "campaign_template_deliverables_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "campaign_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "integration_accounts" ADD CONSTRAINT "integration_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
