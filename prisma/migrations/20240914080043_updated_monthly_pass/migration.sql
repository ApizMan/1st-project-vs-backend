-- AlterTable
ALTER TABLE `monthly_pass` MODIFY `pbt` VARCHAR(191) NOT NULL DEFAULT 'No PBT',
    MODIFY `plate_number` VARCHAR(191) NOT NULL DEFAULT 'No Plate Number';
