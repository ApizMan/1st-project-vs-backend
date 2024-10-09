/*
  Warnings:

  - You are about to drop the column `promotion_id` on the `monthly_pass` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `monthly_pass` DROP FOREIGN KEY `monthly_pass_promotion_id_fkey`;

-- AlterTable
ALTER TABLE `monthly_pass` DROP COLUMN `promotion_id`,
    ADD COLUMN `promotionId` VARCHAR(191) NULL;
