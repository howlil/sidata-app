import prisma from "../../config/db.js";
import { statusTA, status, tipeDosen } from "../../config/typeEnum.js";
import multer from "multer";
import path from "path";
import * as yup from "yup";

const ideTASchema = yup.object().shape({
  idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
  ideTA: yup.string().required("Ide TA wajib diisi"),
  deskrisiIde: yup.string().required("Deskripsi ide wajib diisi"),
  bidangId: yup.string().required("Bidang ID wajib diisi"),
  dosenPembimbinIDs: yup
    .array()
    .of(yup.string().required())
    .min(1)
    .max(2)
    .required("Minimal 1 dosen pembimbing harus dipilih"),
});

const editIdeTASchema = yup.object().shape({
  idTA: yup.string().required("ID TA wajib diisi"),
  ideTA: yup.string().required("Ide TA wajib diisi"),
  deskrisiIde: yup.string().required("Deskripsi ide wajib diisi"),
  bidangId: yup.string().required("Bidang ID wajib diisi"),
  dosenPembimbinIDs: yup
    .array()
    .of(yup.string().required())
    .min(1)
    .max(2)
    .required("Minimal 1 dosen pembimbing harus dipilih"),
});

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

    const { idMahasiswa, ideTA, deskrisiIde, bidangId, dosenPembimbinIDs } =
      req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idMahasiswa } });
    if (existingTA) {
      return res.status(400).json({
        success: false,
        message: "Mahasiswa sudah mengajukan ide TA sebelumnya",
      });
    }

    const newTA = await prisma.tA.create({
      data: {
        idMahasiswa,
        ideTA,
        deskrisiIde,
        bidangId,
        statusTA: statusTA.ide,
        status: status.diproses,
        DosenPembimbingTA: {
          create: dosenPembimbinIDs.map((dosenPembimbinID) => ({
            dosenPembimbinID,
            approved: status.diproses,
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
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error submitting TA idea:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

export const editAjukanIdeTA = async (req, res) => {
  try {
    await editIdeTASchema.validate(req.body);

    const { idTA, ideTA, deskrisiIde, bidangId, dosenPembimbinIDs } = req.body;

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
        deskrisiIde,
        bidangId,
        DosenPembimbingTA: {
          deleteMany: {},
          create: dosenPembimbinIDs.map((dosenPembimbinID) => ({
            dosenPembimbinID,
            approved: status.diproses,
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

    if (existingTA.status !== status.diterima) {
      return res.status(400).json({
        success: false,
        message: "Hanya TA dengan status diterima yang dapat mengajukan judul",
      });
    }

    const updatedTA = await prisma.tA.update({
      where: { idTA },
      data: {
        judulTA,
        status: status.diproses,
      },
    });

    // Reset approval status for all advisors
    await prisma.dosenPembimbingTA.updateMany({
      where: { idTA },
      data: { approved: status.diproses },
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
    cb(null, path.join(__dirname, "../../../public/images/filepdf"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
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
}).fields([
  { name: "transkripNilai", maxCount: 1 },
  { name: "buktiLulus", maxCount: 1 },
  { name: "buktiKRS", maxCount: 1 },
  { name: "suratTugas", maxCount: 1 },
  { name: "suratIzinKuliah", maxCount: 1 },
  { name: "buktiKP", maxCount: 1 },
]);

export const uploadFiles = upload;

export const daftarTA = async (req, res) => {
  uploadFiles(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      await daftarTASchema.validate(req.body);

      const { idMahasiswa, idTA } = req.body;
      const files = req.files;

      if (
        !files.transkripNilai ||
        !files.buktiLulus ||
        !files.buktiKRS ||
        !files.suratTugas ||
        !files.suratIzinKuliah ||
        !files.buktiKP
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Semua file harus diunggah" });
      }

      const newDaftarTA = await prisma.daftarTA.create({
        data: {
          idMahasiswa,
          idTA,
          transkripNilai: files.transkripNilai[0].path,
          buktiLulus: files.buktiLulus[0].path,
          buktiKRS: files.buktiKRS[0].path,
          suratTugas: files.suratTugas[0].path,
          suratIzinKuliah: files.suratIzinKuliah[0].path,
          buktiKP: files.buktiKP[0].path,
          status: status.diproses,
        },
      });

      res.status(201).json({
        success: true,
        message: "Pendaftaran TA berhasil",
        data: newDaftarTA,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res
          .status(400)
          .json({ success: false, message: error.errors.join(", ") });
      }
      console.error("Error registering TA:", error);
      res.status(500).json({
        success: false,
        message: "Kesalahan server: " + error.message,
      });
    }
  });
};
