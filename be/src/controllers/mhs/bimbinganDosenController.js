import prisma from "../../config/db.js";
import * as yup from "yup";
import { status } from "../../config/typeEnum.js";

const ajukanJadwalBimbinganSchema = yup.object().shape({
  idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
  dosPembimbingId: yup.string().required("ID Dosen Pembimbing wajib diisi"),
  kendala: yup.string().required("Kendala wajib diisi"),
  progresTA: yup.string().required("Progres TA wajib diisi"),
  tanggal: yup
    .date()
    .required("Tanggal wajib diisi")
    .test("is-weekday", "Tanggal hanya bisa di hari Senin - Kamis", (value) => {
      const day = new Date(value).getDay();
      return day >= 1 && day <= 4;
    }),
    waktuMulai: yup
    .string()
    .required("Waktu mulai wajib diisi")
    .matches(/^([0-1][0-9]):([0-5][0-9])$/, "Waktu mulai harus antara jam 08:00 dan 14:59")
    .test("is-valid-time", "Waktu mulai harus antara jam 08:00 dan 14:59", (value) => {
      const [hour, minute] = value.split(":").map(Number);
      return hour >= 8 && hour <= 14;
    }),
  waktuSelesai: yup
    .string()
    .required("Waktu selesai wajib diisi")
    .matches(/^([0-1][0-9]):([0-5][0-9])$/, "Waktu selesai harus antara jam 09:00 dan 15:59")
    .test("is-valid-time", "Waktu selesai harus antara jam 09:00 dan 15:59", (value) => {
      const [hour, minute] = value.split(":").map(Number);
      return hour >= 9 && hour <= 15;
    })
    .when("waktuMulai", (waktuMulai, schema) => {
      return schema.test({
        test: (waktuSelesai) => {
          const [startTimeStr] = waktuMulai; // Destructuring to get the string value from array
          
          if (!startTimeStr || typeof startTimeStr !== 'string') {
            return false;
          }

          const [startHour, startMinute] = startTimeStr.split(":").map(Number);
          const [endHour, endMinute] = waktuSelesai.split(":").map(Number);

          console.log(`Start: ${startHour}:${startMinute}`); 
          console.log(`End: ${endHour}:${endMinute}`); 

          if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
            return false;
          }

          const startTime = startHour * 60 + startMinute;
          const endTime = endHour * 60 + endMinute;

          console.log(`Start Time: ${startTime}, End Time: ${endTime}`); // Debugging

          const diffInHours = (endTime - startTime) / 60;
          console.log(`Difference in Hours: ${diffInHours}`); // Debugging

          return endTime > startTime && diffInHours === 1;
        },
        message: "Waktu selesai harus setelah waktu mulai dan harus berjarak 1 jam",
      });
    }),
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

    const waktuMulaiDateTime = new Date(`${tanggal}T${waktuMulai}:00.000Z`);
    const waktuSelesaiDateTime = new Date(`${tanggal}T${waktuSelesai}:00.000Z`);

    const existingJadwal = await prisma.jadwalBimbinganDosen.findFirst({
      where: {
        dosPembimbingId,
        tanggal: new Date(tanggal),
        OR: [
          {
            waktuMulai: {
              lte: waktuMulaiDateTime,
            },
            waktuSelesai: {
              gte: waktuMulaiDateTime,
            },
          },
          {
            waktuMulai: {
              lte: waktuSelesaiDateTime,
            },
            waktuSelesai: {
              gte: waktuSelesaiDateTime,
            },
          },
          {
            waktuMulai: {
              gte: waktuMulaiDateTime,
              lte: waktuSelesaiDateTime,
            },
          },
        ],
      },
    });

    if (existingJadwal) {
      return res.status(400).json({
        success: false,
        message: "Jadwal bimbingan sudah terisi",
      });
    }

    const newJadwalBimbingan = await prisma.jadwalBimbinganDosen.create({
      data: {
        idMahasiswa,
        dosPembimbingId,
        kendala,
        progresTA,
        tanggal: new Date(tanggal),
        waktuMulai: waktuMulaiDateTime,
        waktuSelesai: waktuSelesaiDateTime,
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

export const ubahStatusAjuanBimbingan = async (req, res) => {
  const { idJadwal } = req.params;
  const { status: newStatus } = req.body;

  if (![status.disetujui, status.ditolak].includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: "Status tidak valid",
    });
  }

  try {
    const existingJadwal = await prisma.jadwalBimbinganDosen.findUnique({
      where: { id: idJadwal },
    });

    if (!existingJadwal) {
      return res.status(404).json({
        success: false,
        message: "Jadwal bimbingan tidak ditemukan",
      });
    }

    const updatedJadwal = await prisma.jadwalBimbinganDosen.update({
      where: {
        id: idJadwal,
      },
      data: {
        status: newStatus,
      },
    });

    res.status(200).json({
      success: true,
      message: `Status jadwal bimbingan berhasil diubah menjadi ${newStatus}`,
      data: updatedJadwal,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getJadwalBimbinganByDosen = async (req, res) => {
  const { idDosen } = req.params;

  try {
    const jadwalBimbingan = await prisma.jadwalBimbinganDosen.findMany({
      where: {
        DosenPembimbing: {
          dosenId: idDosen,
        },
      },
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });

    if (jadwalBimbingan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada jadwal bimbingan untuk dosen ini",
      });
    }

    res.status(200).json({
      success: true,
      data: jadwalBimbingan,
    });
  } catch (error) {
    console.error("Error retrieving mentoring schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getJadwalBimbinganByMahasiswa = async (req, res) => {
  const { idMahasiswa } = req.params;

  try {
    const jadwalBimbingan = await prisma.jadwalBimbinganDosen.findMany({
      where: {
        mahasiswaId: idMahasiswa,
      },
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });

    if (jadwalBimbingan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada jadwal bimbingan untuk mahasiswa ini",
      });
    }

    res.status(200).json({
      success: true,
      data: jadwalBimbingan,
    });
  } catch (error) {
    console.error("Error retrieving mentoring schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getJadwalBimbinganByMahasiswaAndDosen = async (req, res) => {
  const { idMahasiswa, idDosen } = req.params;

  try {
    const jadwalBimbingan = await prisma.jadwalBimbinganDosen.findMany({
      where: {
        mahasiswaId: idMahasiswa,
        DosenPembimbing: {
          dosenId: idDosen,
        },
      },
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });

    if (jadwalBimbingan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada jadwal bimbingan untuk mahasiswa ini",
      });
    }

    res.status(200).json({
      success: true,
      data: jadwalBimbingan,
    });
  } catch (error) {
    console.error("Error retrieving mentoring schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getJadwalBimbinganById = async (req, res) => {
  const { idJadwal } = req.params;

  try {
    const jadwalBimbingan = await prisma.jadwalBimbinganDosen.findUnique({
      where: {
        id: idJadwal,
      },
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });

    if (!jadwalBimbingan) {
      return res.status(404).json({
        success: false,
        message: "Jadwal bimbingan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: jadwalBimbingan,
    });
  } catch (error) {
    console.error("Error retrieving mentoring schedule:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getDetailPengajuanJadwalBimbingan = async (req, res) => {
  const { id } = req.params;

  try {
    const jadwalBimbingan = await prisma.jadwalBimbinganDosen.findUnique({
      where: { id },
      include: {
        Mahasiswa: true,
        DosenPembimbing: {
          include: {
            Dosen: true,
          },
        },
      },
    });

    if (!jadwalBimbingan) {
      return res.status(404).json({
        success: false,
        message: "Jadwal bimbingan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: jadwalBimbingan,
    });
  } catch (error) {
    console.error("Error getting mentoring schedule details:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};

