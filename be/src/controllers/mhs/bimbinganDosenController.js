import prisma from "../../config/db.js";
import * as yup from "yup";
import { status } from "../../config/typeEnum.js";

const ajukanJadwalBimbinganSchema = yup.object().shape({
  idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
  dosPembimbingId: yup.string().required("ID Dosen Pembimbing wajib diisi"),
  kendala: yup.string().required("Kendala wajib diisi"),
  progresTA: yup.string().required("Progres TA wajib diisi"),
  tanggal: yup.date().required("Tanggal wajib diisi"),
  waktuMulai: yup.date().required("Waktu mulai wajib diisi"),
  waktuSelesai: yup.date().required("Waktu selesai wajib diisi"),
});

const editJadwalBimbinganSchema = yup.object().shape({
  idJadwal: yup.string().required("ID Jadwal wajib diisi"),
  kendala: yup.string().required("Kendala wajib diisi"),
  progresTA: yup.string().required("Progres TA wajib diisi"),
  tanggal: yup.date().required("Tanggal wajib diisi"),
  waktuMulai: yup.date().required("Waktu mulai wajib diisi"),
  waktuSelesai: yup.date().required("Waktu selesai wajib diisi"),
});

export const ajukanJadwalBimbingan = async (req, res) => {
  try {
    await ajukanJadwalBimbinganSchema.validate(req.body);

    const {
      idMahasiswa,
      dosPembimbingId,
      kendala,
      progresTA,
      tanggal,
      waktuMulai,
      waktuSelesai,
    } = req.body;

    const newJadwalBimbingan = await prisma.jadwalBimbinganDosen.create({
      data: {
        idMahasiswa,
        dosPembimbingId,
        kendala,
        progresTA,
        tanggal,
        waktuMulai,
        waktuSelesai,
        status: status.diproses,
      },
    });

    res.status(201).json({
      success: true,
      message: "Pengajuan jadwal bimbingan berhasil",
      data: newJadwalBimbingan,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error submitting schedule:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getAllJadwalBimbingan = async (req, res) => {
  try {
    const allJadwalBimbingan = await prisma.jadwalBimbinganDosen.findMany({
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });
    if (allJadwalBimbingan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Jadwal Bimbingan tidak ada",
      });
    }

    res.status(200).json({
      success: true,
      data: allJadwalBimbingan,
    });
  } catch (error) {
    console.error("Error retrieving schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getRiwayatBimbingan = async (req, res) => {
  const { idMahasiswa } = req.params;

  try {
    const riwayatBimbingan = await prisma.jadwalBimbinganDosen.findMany({
      where: { idMahasiswa },
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });

    if (riwayatBimbingan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Riwayat bimbingan tidak ditemukan untuk mahasiswa ini",
      });
    }

    res.status(200).json({
      success: true,
      data: riwayatBimbingan,
    });
  } catch (error) {
    console.error("Error retrieving mentoring history:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const editJadwalBimbingan = async (req, res) => {
  try {
    await editJadwalBimbinganSchema.validate(req.body);

    const { idJadwal, kendala, progresTA, tanggal, waktuMulai, waktuSelesai } =
      req.body;

    const existingJadwal = await prisma.jadwalBimbinganDosen.findUnique({
      where: { id: idJadwal },
    });
    if (!existingJadwal) {
      return res
        .status(404)
        .json({ success: false, message: "Jadwal bimbingan tidak ditemukan" });
    }

    if (existingJadwal.status !== status.ditolak) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Hanya jadwal bimbingan yang ditolak yang dapat diedit",
        });
    }

    const updatedJadwal = await prisma.jadwalBimbinganDosen.update({
      where: { id: idJadwal },
      data: {
        kendala,
        progresTA,
        tanggal,
        waktuMulai,
        waktuSelesai,
        status: status.diproses,
      },
    });

    res.status(200).json({
      success: true,
      message: "Jadwal bimbingan berhasil diedit",
      data: updatedJadwal,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error editing schedule:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};
