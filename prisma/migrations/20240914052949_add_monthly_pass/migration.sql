-- CreateTable
CREATE TABLE `monthly_pass` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `plate_number_id` VARCHAR(191) NOT NULL,
    `pbt_id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT 'No Location',
    `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `duration` VARCHAR(191) NOT NULL DEFAULT '0 Month',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `monthly_pass` ADD CONSTRAINT `monthly_pass_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `monthly_pass` ADD CONSTRAINT `monthly_pass_plate_number_id_fkey` FOREIGN KEY (`plate_number_id`) REFERENCES `plate_number`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `monthly_pass` ADD CONSTRAINT `monthly_pass_pbt_id_fkey` FOREIGN KEY (`pbt_id`) REFERENCES `pbt`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
