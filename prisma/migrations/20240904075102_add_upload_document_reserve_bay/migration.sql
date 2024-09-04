/*
  Warnings:

  - Added the required column `designatedBayPicture` to the `reserve_bay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCardPicture` to the `reserve_bay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registerNumberPicture` to the `reserve_bay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reserve_bay` ADD COLUMN `designatedBayPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `idCardPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `registerNumberPicture` VARCHAR(191) NOT NULL;
