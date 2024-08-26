-- DropIndex
DROP INDEX `payment_transaction_user_id_key` ON `payment_transaction`;

-- AlterTable
ALTER TABLE `payment_transaction` MODIFY `order_amount` DOUBLE NULL,
    MODIFY `order_no` VARCHAR(191) NULL,
    MODIFY `order_status` VARCHAR(191) NULL,
    MODIFY `shift_id` VARCHAR(191) NULL,
    MODIFY `store_id` VARCHAR(191) NULL,
    MODIFY `terminal_id` VARCHAR(191) NULL;
