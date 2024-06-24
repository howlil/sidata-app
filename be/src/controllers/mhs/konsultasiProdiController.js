import prisma from "../../config/db.js";
import * as yup from "yup";
import { status } from "../../config/typeEnum.js";

const today = new Date();
today.setHours(0, 0, 0, 0);

const ajukanJadwalKonsulProdiSchema = yup.object().shape({
  idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
  kendala: yup.string().required("Kendala wajib diisi"),
  tanggal: yup
    .date()
    .required("Tanggal wajib diisi")
    .min(today, "Tanggal tidak boleh lebih awal dari hari ini")
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
          const [startTimeStr] = waktuMulai; 
          
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

          console.log(`Start Time: ${startTime}, End Time: ${endTime}`); 

          const diffInHours = (endTime - startTime) / 60;
          console.log(`Difference in Hours: ${diffInHours}`); 

          return endTime > startTime && diffInHours === 1;
        },
        message: "Waktu selesai harus setelah waktu mulai dan harus berjarak 1 jam",
      });
    }),
});


export const ajukanJadwalKonsulProdi = async (req, res) => {
  try {
    await ajukanJadwalKonsulProdiSchema.validate(req.body);

    const { idMahasiswa, kendala, tanggal, waktuMulai, waktuSelesai ,adminId } = req.body;


    const waktuMulaiDateTime = new Date(`${tanggal}T${waktuMulai}:00.000Z`);
    const waktuSelesaiDateTime = new Date(`${tanggal}T${waktuSelesai}:00.000Z`);
    console.log(waktuMulaiDateTime);
    console.log(waktuSelesaiDateTime);
  
      const existingJadwal = await prisma.jadwalKonsulProdi.findFirst({
        where: {
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
          message: "Jadwal konsultasi prodi sudah terisi",
        });
      }
      console.log(waktuMulaiDateTime);
      console.log(waktuSelesaiDateTime);
  
      const newJadwalKonsulProdi = await prisma.jadwalKonsulProdi.create({
        data: {
          idMahasiswa,
          idAdmin: adminId,
          kendala,
          tanggal: new Date(tanggal),
          waktuMulai: waktuMulaiDateTime,
          waktuSelesai: waktuSelesaiDateTime,
          status: status.diproses,
        },
      });
  

    res.status(201).json({
      success: true,
      message: "Pengajuan jadwal konsultasi prodi berhasil",
      data: newJadwalKonsulProdi,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error submitting schedule:", error);
    res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getDetailPengajuanJadwalKonsultasi = async (req, res) => {
  const { id } = req.params;

  try {
    const detailPengajuanJadwalKonsultasi = await prisma.jadwalKonsulProdi.findUnique({
      where: {
        id,
      },
      include: {
        Mahasiswa: true,
        Admin: true,
      },
    });

    if (!detailPengajuanJadwalKonsultasi) {
      return res.status(404).json({
        success: false,
        message: "Pengajuan jadwal konsultasi tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: detailPengajuanJadwalKonsultasi,
    });
  } catch (error) {
    console.error("Error retrieving consultation schedule detail:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getAllJadwalKonsulProdi = async (req, res) => {
  try {
    const allJadwalKonsulProdi = await prisma.jadwalKonsulProdi.findMany({
      include: {
        Mahasiswa: true,
        Admin: true,
      },
    });
    if (allJadwalKonsulProdi.length === 0) {
      return res.status(404).json({
        success: false,
        message: "tidak ada data",
      });
    }

    res.status(200).json({
      success: true,
      data: allJadwalKonsulProdi,
    });
  } catch (error) {
    console.error("Error retrieving schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const getRiwayatKonsulProdi = async (req, res) => {
  const { id } = req.params;

  try {
    const riwayatKonsulProdi = await prisma.jadwalKonsulProdi.findMany({
      where: {
        idMahasiswa:id,
      },
      include: {
        Mahasiswa: true,
        Admin: true,
      },
    });


    res.status(200).json({
      success: true,
      data: riwayatKonsulProdi,
    });
  } catch (error) {
    console.error("Error retrieving consultation history:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};


export const updateStatusJadwalKonsulProdi = async (req, res) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  if (![status.diproses, status.disetujui, status.ditolak].includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: "Status tidak valid",
    });
  }


  try {
    const existingJadwal = await prisma.jadwalKonsulProdi.findUnique({
      where: { id },
    });
    
    if (existingJadwal.status !== status.diproses) {
      return res.status(400).json({
        success: false,
        message: "Status pengajuan sudah final dan tidak bisa diubah lagi",
      });
    }

    const updatedJadwalKonsulProdi = await prisma.jadwalKonsulProdi.update({
      where: {
        id: id,
      },
      data: {
        status: newStatus,
      },
    });

    res.status(200).json({
      success: true,
      message: `Pengajuan konsultasi prodi telah ${newStatus}`,
      data: updatedJadwalKonsulProdi,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

