-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_pbtId_fkey` FOREIGN KEY (`pbtId`) REFERENCES `pbt`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
