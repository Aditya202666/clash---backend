/*
  Warnings:

  - You are about to drop the column `avatar_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clash" DROP CONSTRAINT "Clash_banner_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatar_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar_id";

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "ClashBanner" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "cloud_id" TEXT NOT NULL,
    "clash_id" TEXT NOT NULL,

    CONSTRAINT "ClashBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClashItemImage" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "cloud_id" TEXT NOT NULL,
    "clash_item_id" TEXT NOT NULL,

    CONSTRAINT "ClashItemImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClashItem" (
    "id" TEXT NOT NULL,
    "clash_id" TEXT NOT NULL,
    "clash_item_id" TEXT NOT NULL,
    "image_number" INTEGER NOT NULL,

    CONSTRAINT "ClashItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClashBanner_clash_id_key" ON "ClashBanner"("clash_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClashItem_clash_item_id_key" ON "ClashItem"("clash_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClashItem_clash_id_clash_item_id_key" ON "ClashItem"("clash_id", "clash_item_id");

-- AddForeignKey
ALTER TABLE "ClashBanner" ADD CONSTRAINT "ClashBanner_clash_id_fkey" FOREIGN KEY ("clash_id") REFERENCES "Clash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClashItem" ADD CONSTRAINT "ClashItem_clash_id_fkey" FOREIGN KEY ("clash_id") REFERENCES "Clash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClashItem" ADD CONSTRAINT "ClashItem_clash_item_id_fkey" FOREIGN KEY ("clash_item_id") REFERENCES "ClashItemImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
