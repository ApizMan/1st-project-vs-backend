/*
  Warnings:

  - Added the required column `user_id` to the `compound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `compound` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `compound` ADD CONSTRAINT `compound_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
