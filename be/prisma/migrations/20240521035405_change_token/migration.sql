-- AlterTable
ALTER TABLE `admin` MODIFY `nama` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `dosen` MODIFY `nip` VARCHAR(191) NULL,
    MODIFY `alamat` VARCHAR(191) NULL,
    MODIFY `noHp` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `mahasiswa` MODIFY `nim` VARCHAR(191) NULL,
    MODIFY `alamat` VARCHAR(191) NULL,
    MODIFY `noHp` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `token` MODIFY `token` TEXT NOT NULL;
