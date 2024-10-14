-- CreateTable
CREATE TABLE `compound` (
    `id` VARCHAR(191) NOT NULL,
    `ownerIdNo` VARCHAR(191) NULL DEFAULT '111111111111',
    `ownerCategoryId` VARCHAR(191) NULL DEFAULT '1',
    `vehicleRegistrationNumber` VARCHAR(191) NOT NULL DEFAULT 'ABC123',
    `noticeNo` VARCHAR(191) NOT NULL DEFAULT 'AA11300001',
    `receiptNo` VARCHAR(191) NOT NULL DEFAULT '123456',
    `paymentTransactionType` INTEGER NULL DEFAULT 0,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paymentAmount` INTEGER NOT NULL DEFAULT 0,
    `channelType` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `paymentMode` VARCHAR(191) NULL,
    `paymentLocation` VARCHAR(191) NOT NULL DEFAULT 'STRADA80',
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
