/*
  Warnings:

  - You are about to drop the column `PaymentAmount` on the `compound` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `compound` DROP COLUMN `PaymentAmount`,
    ADD COLUMN `PaidAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0;
