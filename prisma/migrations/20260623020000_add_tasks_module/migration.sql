-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Todo', 'InProgress', 'Blocked', 'InReview', 'Done');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'TaskCreated';
ALTER TYPE "ActivityType" ADD VALUE 'TaskUpdated';
ALTER TYPE "ActivityType" ADD VALUE 'TaskStatusChanged';
ALTER TYPE "ActivityType" ADD VALUE 'TaskCompleted';
ALTER TYPE "ActivityType" ADD VALUE 'TaskArchived';
ALTER TYPE "ActivityType" ADD VALUE 'TaskRestored';
ALTER TYPE "ActivityType" ADD VALUE 'TaskDeleted';
ALTER TYPE "ActivityType" ADD VALUE 'TaskReordered';

-- CreateTable
CREATE TABLE "tasks" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "deal_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "normalized_title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'Todo',
  "priority" "TaskPriority" NOT NULL DEFAULT 'Medium',
  "due_date" TIMESTAMP(3),
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "created_by" UUID NOT NULL,
  "updated_by" UUID NOT NULL,
  "is_archived" BOOLEAN NOT NULL DEFAULT false,
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_deal_archived_order_idx" ON "tasks"("deal_id", "is_archived", "order_index");

-- CreateIndex
CREATE INDEX "tasks_deal_status_archived_idx" ON "tasks"("deal_id", "status", "is_archived");

-- CreateIndex
CREATE INDEX "tasks_deal_priority_archived_idx" ON "tasks"("deal_id", "priority", "is_archived");

-- CreateIndex
CREATE INDEX "tasks_deal_due_date_archived_idx" ON "tasks"("deal_id", "due_date", "is_archived");

-- CreateIndex
CREATE INDEX "tasks_user_updated_at_idx" ON "tasks"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "tasks_deal_title_archived_unique" ON "tasks"("deal_id", "normalized_title", "is_archived");

-- AddForeignKey
ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_deal_id_fkey"
FOREIGN KEY ("deal_id")
REFERENCES "deals"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
