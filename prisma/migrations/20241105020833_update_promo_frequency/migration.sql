/*
  Warnings:

  - You are about to drop the column `timeUse` on the `promotion_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `promotion_history` DROP COLUMN `timeUse`,
    ADD COLUMN `frequency` INTEGER NOT NULL DEFAULT 0;
