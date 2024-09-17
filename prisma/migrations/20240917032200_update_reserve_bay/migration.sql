/*
  Warnings:

  - You are about to alter the column `total_lot_required` on the `reserve_bay` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `reserve_bay` MODIFY `total_lot_required` INTEGER NULL;
