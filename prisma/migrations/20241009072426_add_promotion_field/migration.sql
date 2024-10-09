-- DropForeignKey
ALTER TABLE `monthly_pass` DROP FOREIGN KEY `monthly_pass_promotion_id_fkey`;

-- AlterTable
ALTER TABLE `monthly_pass` MODIFY `promotion_id` VARCHAR(191) NULL;
