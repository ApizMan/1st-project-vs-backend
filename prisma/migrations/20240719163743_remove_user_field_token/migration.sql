/*
  Warnings:

  - You are about to drop the column `userId` on the `token_management` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `token_management` DROP FOREIGN KEY `token_management_userId_fkey`;

-- AlterTable
ALTER TABLE `token_management` DROP COLUMN `userId`;
