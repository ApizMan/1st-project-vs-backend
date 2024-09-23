-- CreateTable
CREATE TABLE `parking` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `wallet_transaction_id` VARCHAR(191) NOT NULL,
    `plate_number` VARCHAR(191) NOT NULL DEFAULT 'No Plate Number',
    `pbt` VARCHAR(191) NOT NULL DEFAULT 'No PBT',
    `location` VARCHAR(191) NOT NULL DEFAULT 'No Location',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `parking` ADD CONSTRAINT `parking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `parking` ADD CONSTRAINT `parking_wallet_transaction_id_fkey` FOREIGN KEY (`wallet_transaction_id`) REFERENCES `wallet_transaction`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
