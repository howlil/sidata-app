-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MAHASISWA', 'DOSEN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DISETUJUI', 'DIPROSES', 'DITOLAK');

-- CreateTable
CREATE TABLE "mahasiswa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nim" TEXT,
    "alamat" TEXT,
    "noHp" TEXT,
    "foto" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MAHASISWA',

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosen" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT,
    "alamat" TEXT,
    "foto" TEXT,
    "noHp" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DOSEN',

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "nama" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "mahasiswaId" TEXT,
    "dosenId" TEXT,
    "adminId" TEXT,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ide" (
    "id" TEXT NOT NULL,
    "namaMahasiswa" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "ideTugasAkhir" TEXT NOT NULL,
    "bidangId" TEXT NOT NULL,
    "calonDospem1Id" TEXT,
    "calonDospem2Id" TEXT,
    "status" "Status" NOT NULL,
    "mahasiswaId" TEXT NOT NULL,

    CONSTRAINT "ide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideDosen" (
    "ideId" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,

    CONSTRAINT "ideDosen_pkey" PRIMARY KEY ("ideId","dosenId")
);

-- CreateTable
CREATE TABLE "judul" (
    "id" TEXT NOT NULL,
    "namaMahasiswa" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "angkatan" TEXT NOT NULL,
    "smtSaatIni" TEXT NOT NULL,
    "bidangPeminatan" TEXT NOT NULL,
    "dosenPembimbing1Id" TEXT,
    "dosenPembimbing2Id" TEXT,
    "judul" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "bidangId" TEXT NOT NULL,
    "mahasiswaId" TEXT NOT NULL,

    CONSTRAINT "judul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judulDosen" (
    "judulId" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,

    CONSTRAINT "judulDosen_pkey" PRIMARY KEY ("judulId","dosenId")
);

-- CreateTable
CREATE TABLE "pendaftaranTA" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "bidangPeminatanId" TEXT NOT NULL,
    "judulTugasAkhir" TEXT NOT NULL,
    "transkripNilai" TEXT NOT NULL,
    "buktiLulusBahasa" TEXT NOT NULL,
    "buktiKRS" TEXT NOT NULL,
    "suratPenunjukanDosen" TEXT NOT NULL,
    "formPermohonanIzinKuliah" TEXT NOT NULL,
    "buktiKP" TEXT NOT NULL,
    "buktiMengambilMataKuliah" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "mahasiswaId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "pendaftaranTA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidang" (
    "id" TEXT NOT NULL,
    "bidang" TEXT NOT NULL,

    CONSTRAINT "bidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidangDosen" (
    "bidangId" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,

    CONSTRAINT "bidangDosen_pkey" PRIMARY KEY ("bidangId","dosenId")
);

-- CreateTable
CREATE TABLE "bimbinganTA" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "mahasiswaId" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "judulTugasAkhir" TEXT NOT NULL,
    "progres" TEXT NOT NULL,
    "kendala" TEXT NOT NULL,
    "jadwalBimbingan" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "bimbinganTA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "konsultasiKaprodi" (
    "mahasiswaId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "kendala" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "jadwalKonsultasi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "konsultasiKaprodi_pkey" PRIMARY KEY ("mahasiswaId","adminId")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" TEXT NOT NULL,
    "pengirimId" TEXT NOT NULL,
    "penerimaId" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_email_key" ON "mahasiswa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_nim_key" ON "mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_email_key" ON "dosen"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_nip_key" ON "dosen"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ide_mahasiswaId_key" ON "ide"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "judul_mahasiswaId_key" ON "judul"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "pendaftaranTA_mahasiswaId_key" ON "pendaftaranTA"("mahasiswaId");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ide" ADD CONSTRAINT "ide_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ide" ADD CONSTRAINT "ide_calonDospem1Id_fkey" FOREIGN KEY ("calonDospem1Id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ide" ADD CONSTRAINT "ide_calonDospem2Id_fkey" FOREIGN KEY ("calonDospem2Id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ide" ADD CONSTRAINT "ide_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideDosen" ADD CONSTRAINT "ideDosen_ideId_fkey" FOREIGN KEY ("ideId") REFERENCES "ide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideDosen" ADD CONSTRAINT "ideDosen_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judul" ADD CONSTRAINT "judul_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judul" ADD CONSTRAINT "judul_dosenPembimbing1Id_fkey" FOREIGN KEY ("dosenPembimbing1Id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judul" ADD CONSTRAINT "judul_dosenPembimbing2Id_fkey" FOREIGN KEY ("dosenPembimbing2Id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judul" ADD CONSTRAINT "judul_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judulDosen" ADD CONSTRAINT "judulDosen_judulId_fkey" FOREIGN KEY ("judulId") REFERENCES "judul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judulDosen" ADD CONSTRAINT "judulDosen_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaranTA" ADD CONSTRAINT "pendaftaranTA_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaranTA" ADD CONSTRAINT "pendaftaranTA_bidangPeminatanId_fkey" FOREIGN KEY ("bidangPeminatanId") REFERENCES "bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaranTA" ADD CONSTRAINT "pendaftaranTA_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidangDosen" ADD CONSTRAINT "bidangDosen_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidangDosen" ADD CONSTRAINT "bidangDosen_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bimbinganTA" ADD CONSTRAINT "bimbinganTA_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bimbinganTA" ADD CONSTRAINT "bimbinganTA_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konsultasiKaprodi" ADD CONSTRAINT "konsultasiKaprodi_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konsultasiKaprodi" ADD CONSTRAINT "konsultasiKaprodi_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
