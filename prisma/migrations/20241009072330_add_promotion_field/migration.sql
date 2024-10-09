/*
  Warnings:

  - You are about to drop the column `promotionId` on the `monthly_pass` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `monthly_pass` DROP COLUMN `promotionId`,
    ADD COLUMN `promotion_id` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `monthly_pass` ADD CONSTRAINT `monthly_pass_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `promotion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
