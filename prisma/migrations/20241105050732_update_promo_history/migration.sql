-- DropForeignKey
ALTER TABLE `promotion_history` DROP FOREIGN KEY `promotion_history_promotion_id_fkey`;

-- AlterTable
ALTER TABLE `promotion_history` MODIFY `promotion_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `promotion_history` ADD CONSTRAINT `promotion_history_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `promotion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
