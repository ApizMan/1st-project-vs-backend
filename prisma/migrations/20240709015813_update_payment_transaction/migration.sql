/*
  Warnings:

  - You are about to drop the column `amount` on the `payment_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `payment_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `payment_transaction` table. All the data in the column will be lost.
  - Added the required column `order_amount` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_no` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_status` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift_id` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terminal_id` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_transaction` DROP COLUMN `amount`,
    DROP COLUMN `status`,
    DROP COLUMN `type`,
    ADD COLUMN `order_amount` DOUBLE NOT NULL,
    ADD COLUMN `order_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `order_status` VARCHAR(191) NOT NULL,
    ADD COLUMN `shift_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `store_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `terminal_id` VARCHAR(191) NOT NULL;
