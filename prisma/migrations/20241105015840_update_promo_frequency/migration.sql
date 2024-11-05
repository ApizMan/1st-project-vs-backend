/*
  Warnings:

  - You are about to drop the column `timeUse` on the `promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `promotion` DROP COLUMN `timeUse`,
    ADD COLUMN `frequency` INTEGER NULL;
