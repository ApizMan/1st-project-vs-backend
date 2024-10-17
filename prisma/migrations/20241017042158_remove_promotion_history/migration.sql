/*
  Warnings:

  - You are about to drop the `promotion_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `promotion_history` DROP FOREIGN KEY `promotion_history_promotion_id_fkey`;

-- DropForeignKey
ALTER TABLE `promotion_history` DROP FOREIGN KEY `promotion_history_user_id_fkey`;

-- DropTable
DROP TABLE `promotion_history`;
