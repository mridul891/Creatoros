/*
  Warnings:

  - You are about to drop the column `user_id` on the `creators` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `creators` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `creators` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "creators" DROP CONSTRAINT "creators_user_id_fkey";

-- DropIndex
DROP INDEX "creators_user_id_key";

-- AlterTable
ALTER TABLE "creators" DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "creators_userId_key" ON "creators"("userId");

-- AddForeignKey
ALTER TABLE "creators" ADD CONSTRAINT "creators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
