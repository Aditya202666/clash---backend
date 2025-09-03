/*
  Warnings:

  - You are about to drop the column `clash_item_id` on the `ClashComment` table. All the data in the column will be lost.
  - Added the required column `clash_id` to the `ClashComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClashComment" DROP CONSTRAINT "ClashComment_clash_item_id_fkey";

-- AlterTable
ALTER TABLE "ClashComment" DROP COLUMN "clash_item_id",
ADD COLUMN     "clash_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ClashComment" ADD CONSTRAINT "ClashComment_clash_id_fkey" FOREIGN KEY ("clash_id") REFERENCES "Clash"("id") ON DELETE CASCADE ON UPDATE CASCADE;
