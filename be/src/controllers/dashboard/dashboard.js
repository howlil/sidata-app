import prisma from "../../config/db.js";
import * as yup from "yup";

const dosenPembimbingIDSchema = yup.object({
  dosenPembimbingID: yup.string().required("ID dosen pembimbing diperlukan"),
});
export const getMahasiswaBimbingan = async (req, res) => {
  try {
    await dosenPembimbingIDSchema.validate(req.params);

    const { dosenPembimbingID } = req.params;

    if (!dosenPembimbingID) {
      return res
        .status(400)
        .json({ success: false, message: "ID dosen pembimbing diperlukan" });
    }

    const mahasiswaBimbingan = await prisma.dosenPembimbingTA.findMany({
      where: { dosenPembimbingID },
      include: {
        TA: {
          include: {
            Mahasiswa: true,
          },
        },
      },
    });

    const jumlahMahasiswa = mahasiswaBimbingan.reduce((count, bimbingan) => {
      if (bimbingan.TA && bimbingan.TA.Mahasiswa) {
        return count + 1;
      }
      return count;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        dosenPembimbingID,
        jumlahMahasiswa,
        mahasiswaBimbingan,
      },
    });
  } catch (error) {
    console.error("Error getting mahasiswa bimbingan:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};

export const getJumlahDosen = async (req, res) => {
  try {
    const jumlahDosen = await prisma.dosen.count();

    if (jumlahDosen === 0) {
        return res.status(200).json({ success: true, message: "Data dosen belum ada", data: 0 });
    }

    res.status(200).json({
      success: true,
      data: {
        jumlahDosen,
      },
    });
  } catch (error) {
    console.error("Error getting jumlah dosen:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};

export const getJumlahMahasiswa = async (req, res) => {
    try {
        const jumlahMahasiswa = await prisma.mahasiswa.count();
    
        if (jumlahMahasiswa === 0) {
            return res.status(200).json({ success: true, message: "Data mahasiswa belum ada", data: 0 });
        }
    
        res.status(200).json({
        success: true,
        data: {
            jumlahMahasiswa,
        },
        });
    } catch (error) {
        console.error("Error getting jumlah mahasiswa:", error);
        res.status(500).json({
        success: false,
        message: "Kesalahan server: " + error.message,
        });
    }
}

export const getJumlahTAterdaftar = async (req, res) => {
    try {
        const jumlahTAterdaftar = await prisma.daftarTA.count({
            where: {
                status: 'disetujui', 
                TA: {
                    status: 'disetujui', 
                    statusTA: 'proposal' 
                }
            }
        });
    
        if (jumlahTAterdaftar === 0) {
            return res.status(200).json({ success: true, message: "Data TA terdaftar belum ada", data: 0 });
        }
    
        res.status(200).json({
            success: true,
            data: {
                jumlahTAterdaftar,
            },
        });
    } catch (error) {
        console.error("Error getting jumlah TA terdaftar:", error);
        res.status(500).json({
            success: false,
            message: "Kesalahan server: " + error.message,
        });
    }
}