/*
  Warnings:

  - You are about to drop the column `pbt_id` on the `monthly_pass` table. All the data in the column will be lost.
  - You are about to drop the column `plate_number_id` on the `monthly_pass` table. All the data in the column will be lost.
  - Added the required column `pbt` to the `monthly_pass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plate_number` to the `monthly_pass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `monthly_pass` DROP FOREIGN KEY `monthly_pass_pbt_id_fkey`;

-- DropForeignKey
ALTER TABLE `monthly_pass` DROP FOREIGN KEY `monthly_pass_plate_number_id_fkey`;

-- AlterTable
ALTER TABLE `monthly_pass` DROP COLUMN `pbt_id`,
    DROP COLUMN `plate_number_id`,
    ADD COLUMN `pbt` VARCHAR(191) NOT NULL,
    ADD COLUMN `plate_number` VARCHAR(191) NOT NULL;
