-- CreateEnum
CREATE TYPE "CreatorType" AS ENUM ('Micro', 'Mid', 'Macro');

-- CreateTable
CREATE TABLE "creators" (
    "id" UUID NOT NULL,
    "creator_type" "CreatorType" NOT NULL DEFAULT 'Micro',
    "niche" TEXT,
    "instagram_handle" TEXT,
    "youtube_handle" TEXT,
    "bio" TEXT,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_user_id_key" ON "creators"("user_id");

-- AddForeignKey
ALTER TABLE "creators" ADD CONSTRAINT "creators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
