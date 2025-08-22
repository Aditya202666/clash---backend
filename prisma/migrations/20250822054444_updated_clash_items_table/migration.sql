/*
  Warnings:

  - You are about to drop the column `clash_item_id` on the `ClashItem` table. All the data in the column will be lost.
  - You are about to drop the `ClashItemImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cloud_id` to the `ClashItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `ClashItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClashItem" DROP CONSTRAINT "ClashItem_clash_item_id_fkey";

-- DropIndex
DROP INDEX "ClashItem_clash_id_clash_item_id_key";

-- DropIndex
DROP INDEX "ClashItem_clash_item_id_key";

-- AlterTable
ALTER TABLE "ClashItem" DROP COLUMN "clash_item_id",
ADD COLUMN     "cloud_id" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL;

-- DropTable
DROP TABLE "ClashItemImage";
