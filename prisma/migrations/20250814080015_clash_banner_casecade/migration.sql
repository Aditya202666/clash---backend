-- DropForeignKey
ALTER TABLE "Clash" DROP CONSTRAINT "Clash_banner_id_fkey";

-- AddForeignKey
ALTER TABLE "Clash" ADD CONSTRAINT "Clash_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
