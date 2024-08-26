/*
  Warnings:

  - You are about to drop the column `pbt_id` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `pbtId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_pbt_id_fkey`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `pbt_id`,
    ADD COLUMN `pbtId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_pbtId_fkey` FOREIGN KEY (`pbtId`) REFERENCES `pbt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
