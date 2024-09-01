/*
  Warnings:

  - Added the required column `type` to the `token_management` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `token_management` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `wallet` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0;
