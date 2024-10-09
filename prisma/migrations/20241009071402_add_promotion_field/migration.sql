/*
  Warnings:

  - Added the required column `promotion_id` to the `monthly_pass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `monthly_pass` ADD COLUMN `promotion_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reserve_bay` MODIFY `designatedBayPicture` VARCHAR(191) NULL,
    MODIFY `idCardPicture` VARCHAR(191) NULL,
    MODIFY `registerNumberPicture` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Promotion` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'No Title',
    `description` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `image` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `monthly_pass` ADD CONSTRAINT `monthly_pass_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `Promotion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
