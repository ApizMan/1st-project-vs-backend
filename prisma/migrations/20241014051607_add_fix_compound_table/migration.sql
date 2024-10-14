/*
  Warnings:

  - You are about to drop the column `channelType` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `noticeNo` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `ownerCategoryId` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `ownerIdNo` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `paymentAmount` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `paymentLocation` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMode` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTransactionType` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `receiptNo` on the `compound` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleRegistrationNumber` on the `compound` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `compound` DROP COLUMN `channelType`,
    DROP COLUMN `notes`,
    DROP COLUMN `noticeNo`,
    DROP COLUMN `ownerCategoryId`,
    DROP COLUMN `ownerIdNo`,
    DROP COLUMN `paymentAmount`,
    DROP COLUMN `paymentDate`,
    DROP COLUMN `paymentLocation`,
    DROP COLUMN `paymentMode`,
    DROP COLUMN `paymentStatus`,
    DROP COLUMN `paymentTransactionType`,
    DROP COLUMN `receiptNo`,
    DROP COLUMN `vehicleRegistrationNumber`,
    ADD COLUMN `ChannelType` VARCHAR(191) NULL,
    ADD COLUMN `Notes` VARCHAR(191) NULL,
    ADD COLUMN `NoticeNo` VARCHAR(191) NOT NULL DEFAULT 'AA11300001',
    ADD COLUMN `OwnerCategoryId` VARCHAR(191) NULL DEFAULT '1',
    ADD COLUMN `OwnerIdNo` VARCHAR(191) NULL DEFAULT '111111111111',
    ADD COLUMN `PaymentAmount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `PaymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `PaymentLocation` VARCHAR(191) NOT NULL DEFAULT 'STRADA80',
    ADD COLUMN `PaymentMode` VARCHAR(191) NULL,
    ADD COLUMN `PaymentStatus` VARCHAR(191) NULL,
    ADD COLUMN `PaymentTransactionType` INTEGER NULL DEFAULT 0,
    ADD COLUMN `ReceiptNo` VARCHAR(191) NOT NULL DEFAULT '123456',
    ADD COLUMN `VehicleRegistrationNumber` VARCHAR(191) NOT NULL DEFAULT 'ABC123';
