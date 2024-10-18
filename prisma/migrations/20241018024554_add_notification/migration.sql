-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'No Title',
    `description` VARCHAR(191) NULL,
    `notifyTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parking_id` VARCHAR(191) NULL,
    `reserve_bay_id` VARCHAR(191) NULL,
    `monthly_pass_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_parking_id_fkey` FOREIGN KEY (`parking_id`) REFERENCES `parking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_reserve_bay_id_fkey` FOREIGN KEY (`reserve_bay_id`) REFERENCES `reserve_bay`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_monthly_pass_id_fkey` FOREIGN KEY (`monthly_pass_id`) REFERENCES `monthly_pass`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
