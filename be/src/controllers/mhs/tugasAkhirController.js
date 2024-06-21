import prisma from "../../config/db.js";
import { statusTA, status } from "../../config/typeEnum.js";
import multer from "multer";
import * as yup from "yup";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ideTASchema = yup.object().shape({
  idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
  ideTA: yup.string().required("Ide TA wajib diisi"),
  deskripsiIde: yup.string().required("Deskripsi ide wajib diisi"),
  bidangId: yup.string().required("Bidang ID wajib diisi"),
  dosenPembimbingIDs: yup
    .array()
    .of(
      yup.object().shape({
        dosenPembimbingID: yup.string().required("ID dosen pembimbing wajib diisi"),
      })
    )
    .min(1, "Minimal 1 dosen pembimbing harus dipilih")
    .max(2, "Maksimal 2 dosen pembimbing dapat dipilih")
  
})

const editIdeTASchema = yup.object().shape({
  idTA: yup.string().required("ID TA wajib diisi"),
  ideTA: yup.string().required("Ide TA wajib diisi"),
  deskripsiIde: yup.string().required("Deskripsi ide wajib diisi"),
  bidangId: yup.string().required("Bidang ID wajib diisi"),
  dosenPembimbingIDs: yup
    .array()
    .of(
      yup.object().shape({
        dosenPembimbingID: yup.string().required("ID dosen pembimbing wajib diisi"),
      })
    )
    .min(1, "Minimal 1 dosen pembimbing harus dipilih")
    .max(2, "Maksimal 2 dosen pembimbing dapat dipilih")
  
})

const ajukanJudulTASchema = yup.object().shape({
  idTA: yup.string().required("ID TA wajib diisi"),
  judulTA: yup.string().required("Judul TA wajib diisi"),
});

const editJudulTASchema = yup.object().shape({
  idTA: yup.string().required("ID TA wajib diisi"),
  judulTA: yup.string().required("Judul TA wajib diisi"),
});

const daftarTASchema = yup.object().shape({
  idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
  idTA: yup.string().required("ID TA wajib diisi"),
});



export const ajukanIdeTA = async (req, res) => {
  try {
    await ideTASchema.validate(req.body);

    const { idMahasiswa, ideTA, deskripsiIde, bidangId, dosenPembimbingIDs } = req.body;

    
    const existingTA = await prisma.tA.findUnique({ where: { idMahasiswa } });
    if (existingTA) {
      return res.status(400).json({
        success: false,
        message: "Mahasiswa sudah mengajukan ide TA sebelumnya",
      });
    }  
      const dosenPembimbingIDList = dosenPembimbingIDs.map((item) => item.dosenPembimbingID);
      const validDosenPembimbing = await prisma.dosenPembimbing.findMany({
        where: {
          id: { in: dosenPembimbingIDList }
        },
        select: {
          id: true
        }
      });
  
      if (validDosenPembimbing.length !== dosenPembimbingIDList.length) {
        return res.status(400).json({
          success: false,
          message: "Satu atau lebih ID dosen pembimbing tidak valid",
        });
      }

    const newTA = await prisma.tA.create({
      data: {
        idMahasiswa,
        ideTA,
        deskripsiIde, 
        bidangId,
        statusTA: statusTA.belumAda,
        status: status.diproses,
        DosenPembimbingTA: {
          create: dosenPembimbingIDs.map(({ dosenPembimbingID }) => ({
            dosenPembimbingID,
            status: status.diproses,
          })),
        },
      },
      include: {
        DosenPembimbingTA: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Ide TA berhasil diajukan",
      data: newTA,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error submitting TA idea:", error);
    res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
  }
};


export const editAjukanIdeTA = async (req, res) => {
  try {
    await editIdeTASchema.validate(req.body);

    const {  ideTA, deskripsiIde, bidangId, dosenPembimbinIDs ,idTA,} = req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idTA } });
    if (!existingTA) {
      return res
        .status(404)
        .json({ success: false, message: "TA tidak ditemukan" });
    }

    if (existingTA.status !== status.ditolak) {
      return res.status(400).json({
        success: false,
        message: "Hanya TA dengan status ditolak yang dapat diedit",
      });
    }

    const updatedTA = await prisma.tA.update({
      where: { idTA },
      data: {
        ideTA,
        deskripsiIde,
        bidangId,
        status: status.diproses,  
        DosenPembimbingTA: {
          deleteMany: {},
          create: dosenPembimbinIDs?.map((dosenPembimbinID) => ({
            dosenPembimbinID,
            status: status.diproses,
          })),
        },
      },
      include: {
        DosenPembimbingTA: true,
      },
    });
    
    res.status(200).json({
      success: true,
      message: "Ide TA berhasil diedit",
      data: updatedTA,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error editing TA idea:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};



export const ajukanJudulTA = async (req, res) => {
  try {
    await ajukanJudulTASchema.validate(req.body);

    const { idTA, judulTA } = req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idTA } });
    if (!existingTA) {
      return res
        .status(404)
        .json({ success: false, message: "TA tidak ditemukan" });
    }

    if (existingTA.status !== status.disetujui && existingTA.statusTA !== statusTA.ide) {
      return res.status(400).json({
        success: false,
        message: "Hanya TA dengan status diterima dan berupa ide yang dapat mengajukan judul",
      });
    }

    const updatedTA = await prisma.tA.update({
      where: { idTA },
      data: {
        judulTA,
        status: status.diproses,
      },
    });

    await prisma.dosenPembimbingTA.updateMany({
      where: { idTA },
      data: { status: status.diproses },
    });

    res.status(200).json({
      success: true,
      message: "Judul TA berhasil diajukan",
      data: updatedTA,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error submitting TA title:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const editJudulTA = async (req, res) => {
  try {
    await editJudulTASchema.validate(req.body);

    const { idTA, judulTA } = req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idTA } });
    if (!existingTA) {
      return res
        .status(404)
        .json({ success: false, message: "TA tidak ditemukan" });
    }

    if (existingTA.status !== status.ditolak) {
      return res.status(400).json({
        success: false,
        message: "Hanya TA dengan status ditolak yang dapat mengubah judul",
      });
    }

    const updatedTA = await prisma.tA.update({
      where: { idTA },
      data: { judulTA, status: status.diproses },
    });

    res.status(200).json({
      success: true,
      message: "Judul TA berhasil diedit",
      data: updatedTA,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error editing TA title:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination for', file.originalname);
   const destPath = path.join(__dirname, "../../../public/images/filepdf");
    console.log('Setting destination for', file.originalname, 'to', destPath); // Debugging
    cb(null, destPath);  
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    console.log('Setting filename for', file.originalname, 'to', filename);
    cb(null, filename);
  },
});

const fileFilter = function (req, file, cb) {
  console.log('Filtering file', file.originalname);
  const allowedTypes = ["application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new multer.MulterError(
      "Jenis File Tidak Di izinkan, Hanya PDF yg Di izinkan"
    );
    error.message = "Jenis File Tidak Di izinkan, Hanya PDF yg Di izinkan";
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


export const uploadTranskripNilai = upload.single('transkripNilai');
export const uploadBuktiLulus = upload.single('buktiLulus');
export const uploadBuktiKRS = upload.single('buktiKRS');
export const uploadSuratTugas = upload.single('suratTugas');
export const uploadSuratIzinKuliah = upload.single('suratIzinKuliah');
export const uploadBuktiKP = upload.single('buktiKP');

