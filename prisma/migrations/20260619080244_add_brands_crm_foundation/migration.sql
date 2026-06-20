-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "category" TEXT,
    "website" TEXT,
    "primary_contact_name" TEXT,
    "primary_contact_email" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "brands_user_id_updated_at_idx" ON "brands"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "brands_user_id_category_idx" ON "brands"("user_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "brands_user_id_normalized_name_key" ON "brands"("user_id", "normalized_name");

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
