/*
  Warnings:

  - You are about to drop the column `image_number` on the `ClashItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clash" DROP CONSTRAINT "Clash_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ClashBanner" DROP CONSTRAINT "ClashBanner_clash_id_fkey";

-- DropForeignKey
ALTER TABLE "ClashItem" DROP CONSTRAINT "ClashItem_clash_id_fkey";

-- AlterTable
ALTER TABLE "ClashItem" DROP COLUMN "image_number",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ClashComment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "clash_item_id" TEXT NOT NULL,

    CONSTRAINT "ClashComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clash" ADD CONSTRAINT "Clash_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClashBanner" ADD CONSTRAINT "ClashBanner_clash_id_fkey" FOREIGN KEY ("clash_id") REFERENCES "Clash"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClashItem" ADD CONSTRAINT "ClashItem_clash_id_fkey" FOREIGN KEY ("clash_id") REFERENCES "Clash"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClashComment" ADD CONSTRAINT "ClashComment_clash_item_id_fkey" FOREIGN KEY ("clash_item_id") REFERENCES "ClashItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
