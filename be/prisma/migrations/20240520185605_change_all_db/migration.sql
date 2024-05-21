/*
  Warnings:

  - You are about to drop the column `userId` on the `token` table. All the data in the column will be lost.
  - You are about to alter the column `token` on the `token` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_userId_fkey`;

-- DropIndex
DROP INDEX `Token_token_key` ON `token`;

-- AlterTable
ALTER TABLE `token` DROP COLUMN `userId`,
    ADD COLUMN `adminId` VARCHAR(191) NULL,
    ADD COLUMN `dosenId` VARCHAR(191) NULL,
    ADD COLUMN `mahasiswaId` VARCHAR(191) NULL,
    MODIFY `token` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL DEFAULT 'MAHASISWA',

    UNIQUE INDEX `mahasiswa_email_key`(`email`),
    UNIQUE INDEX `mahasiswa_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL DEFAULT 'DOSEN',

    UNIQUE INDEX `dosen_email_key`(`email`),
    UNIQUE INDEX `dosen_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL DEFAULT 'ADMIN',

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ide` (
    `id` VARCHAR(191) NOT NULL,
    `namaMahasiswa` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `ideTugasAkhir` VARCHAR(191) NOT NULL,
    `bidangId` VARCHAR(191) NOT NULL,
    `calonDospem1Id` VARCHAR(191) NULL,
    `calonDospem2Id` VARCHAR(191) NULL,
    `status` ENUM('DISETUJUI', 'DIPROSES', 'DITOLAK') NOT NULL,
    `mahasiswaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ide_mahasiswaId_key`(`mahasiswaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ideDosen` (
    `ideId` VARCHAR(191) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ideId`, `dosenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `judul` (
    `id` VARCHAR(191) NOT NULL,
    `namaMahasiswa` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `angkatan` VARCHAR(191) NOT NULL,
    `smtSaatIni` VARCHAR(191) NOT NULL,
    `bidangPeminatan` VARCHAR(191) NOT NULL,
    `dosenPembimbing1Id` VARCHAR(191) NULL,
    `dosenPembimbing2Id` VARCHAR(191) NULL,
    `judul` VARCHAR(191) NOT NULL,
    `status` ENUM('DISETUJUI', 'DIPROSES', 'DITOLAK') NOT NULL,
    `bidangId` VARCHAR(191) NOT NULL,
    `mahasiswaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `judul_mahasiswaId_key`(`mahasiswaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `judulDosen` (
    `judulId` VARCHAR(191) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`judulId`, `dosenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaranTA` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `bidangPeminatanId` VARCHAR(191) NOT NULL,
    `judulTugasAkhir` VARCHAR(191) NOT NULL,
    `transkripNilai` VARCHAR(191) NOT NULL,
    `buktiLulusBahasa` VARCHAR(191) NOT NULL,
    `buktiKRS` VARCHAR(191) NOT NULL,
    `suratPenunjukanDosen` VARCHAR(191) NOT NULL,
    `formPermohonanIzinKuliah` VARCHAR(191) NOT NULL,
    `buktiKP` VARCHAR(191) NOT NULL,
    `buktiMengambilMataKuliah` VARCHAR(191) NOT NULL,
    `status` ENUM('DISETUJUI', 'DIPROSES', 'DITOLAK') NOT NULL,
    `mahasiswaId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pendaftaranTA_mahasiswaId_key`(`mahasiswaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bidang` (
    `id` VARCHAR(191) NOT NULL,
    `bidang` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bidangDosen` (
    `bidangId` VARCHAR(191) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`bidangId`, `dosenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bimbinganTA` (
    `id` VARCHAR(191) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,
    `mahasiswaId` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `judulTugasAkhir` VARCHAR(191) NOT NULL,
    `progres` VARCHAR(191) NOT NULL,
    `kendala` VARCHAR(191) NOT NULL,
    `jadwalBimbingan` DATETIME(3) NOT NULL,
    `status` ENUM('DISETUJUI', 'DIPROSES', 'DITOLAK') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `konsultasiKaprodi` (
    `mahasiswaId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `kendala` VARCHAR(191) NOT NULL,
    `status` ENUM('DISETUJUI', 'DIPROSES', 'DITOLAK') NOT NULL,
    `jadwalKonsultasi` DATETIME(3) NOT NULL,

    PRIMARY KEY (`mahasiswaId`, `adminId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasi` (
    `id` VARCHAR(191) NOT NULL,
    `pengirimId` VARCHAR(191) NOT NULL,
    `penerimaId` VARCHAR(191) NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `token` ADD CONSTRAINT `token_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ide` ADD CONSTRAINT `ide_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `bidang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ide` ADD CONSTRAINT `ide_calonDospem1Id_fkey` FOREIGN KEY (`calonDospem1Id`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ide` ADD CONSTRAINT `ide_calonDospem2Id_fkey` FOREIGN KEY (`calonDospem2Id`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ide` ADD CONSTRAINT `ide_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ideDosen` ADD CONSTRAINT `ideDosen_ideId_fkey` FOREIGN KEY (`ideId`) REFERENCES `ide`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ideDosen` ADD CONSTRAINT `ideDosen_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judul` ADD CONSTRAINT `judul_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `bidang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judul` ADD CONSTRAINT `judul_dosenPembimbing1Id_fkey` FOREIGN KEY (`dosenPembimbing1Id`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judul` ADD CONSTRAINT `judul_dosenPembimbing2Id_fkey` FOREIGN KEY (`dosenPembimbing2Id`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judul` ADD CONSTRAINT `judul_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judulDosen` ADD CONSTRAINT `judulDosen_judulId_fkey` FOREIGN KEY (`judulId`) REFERENCES `judul`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judulDosen` ADD CONSTRAINT `judulDosen_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaranTA` ADD CONSTRAINT `pendaftaranTA_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaranTA` ADD CONSTRAINT `pendaftaranTA_bidangPeminatanId_fkey` FOREIGN KEY (`bidangPeminatanId`) REFERENCES `bidang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaranTA` ADD CONSTRAINT `pendaftaranTA_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bidangDosen` ADD CONSTRAINT `bidangDosen_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `bidang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bidangDosen` ADD CONSTRAINT `bidangDosen_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bimbinganTA` ADD CONSTRAINT `bimbinganTA_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bimbinganTA` ADD CONSTRAINT `bimbinganTA_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `konsultasiKaprodi` ADD CONSTRAINT `konsultasiKaprodi_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `konsultasiKaprodi` ADD CONSTRAINT `konsultasiKaprodi_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
