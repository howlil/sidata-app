import prisma from "../../config/db.js";
import { statusTA, status } from "../../config/typeEnum.js";
import multer from "multer";
import path from "path";
import * as yup from "yup";
import { fileURLToPath } from "url";

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
        dosenPembimbingID: yup
          .string()
          .required("ID dosen pembimbing wajib diisi"),
      })
    )
    .min(1, "Minimal 1 dosen pembimbing harus dipilih")
    .max(2, "Maksimal 2 dosen pembimbing dapat dipilih"),
});

const editIdeTASchema = yup.object().shape({
  idTA: yup.string().required("ID TA wajib diisi"),
  ideTA: yup.string().required("Ide TA wajib diisi"),
  deskripsiIde: yup.string().required("Deskripsi ide wajib diisi"),
  bidangId: yup.string().required("Bidang ID wajib diisi"),
  dosenPembimbingIDs: yup
    .array()
    .of(
      yup.object().shape({
        dosenPembimbingID: yup
          .string()
          .required("ID dosen pembimbing wajib diisi"),
      })
    )
    .min(1, "Minimal 1 dosen pembimbing harus dipilih")
    .max(2, "Maksimal 2 dosen pembimbing dapat dipilih"),
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
const editdaftarTASchema = yup.object().shape({
  idDaftarTA: yup.string().required("ID Daftar TA tidak ditemukan"),
  idMahasiswa: yup.string().required("ID Mahasiswa  tidak ditemukan"),
  idTA: yup.string().required("ID TA  tidak ditemukan"),
});

export const ajukanIdeTA = async (req, res) => {
  try {
    await ideTASchema.validate(req.body);

    const { idMahasiswa, ideTA, deskripsiIde, bidangId, dosenPembimbingIDs } =
      req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idMahasiswa } });
    if (existingTA) {
      return res.status(400).json({
        success: false,
        message: "Mahasiswa sudah mengajukan ide TA sebelumnya",
      });
    }
    const dosenPembimbingIDList = dosenPembimbingIDs.map(
      (item) => item.dosenPembimbingID
    );
    const validDosenPembimbing = await prisma.dosenPembimbing.findMany({
      where: {
        id: { in: dosenPembimbingIDList },
      },
      select: {
        id: true,
      },
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

    const { ideTA, deskripsiIde, bidangId, dosenPembimbinIDs, idTA } = req.body;

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

    if (existingTA.status !== status.disetujui) {
      return res.status(400).json({
        success: false,
        message: "Hanya TA dengan status disetujui yang dapat mengajukan judul",
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
    if (
      file.fieldname === "transkripNilai" ||
      file.fieldname === "buktiLulus" ||
      file.fieldname === "buktiKRS" ||
      file.fieldname === "suratTugas" ||
      file.fieldname === "suratIzinKuliah" ||
      file.fieldname === "buktiKP"
    ) {
      cb(null, path.join(__dirname, "../../../public/images/filepdf"));
      console.log(path.join(__dirname, "../../../public/images/filepdf"));
    } else {
      cb(new Error("Invalid field name"), null);
    }
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
  console.log(file);
  cb(null, true);
};

export const upload = multer({
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

export const daftarTA = async (req, res) => {
  try {
    await daftarTASchema.validate(req.body);

    const { idMahasiswa, idTA } = req.body;
    const transkripNilai = req.files["transkripNilai"]
      ? req.files["transkripNilai"][0]
      : null;
    const buktiLulus = req.files["buktiLulus"]
      ? req.files["buktiLulus"][0]
      : null;
    const buktiKRS = req.files["buktiKRS"] ? req.files["buktiKRS"][0] : null;
    const suratTugas = req.files["suratTugas"]
      ? req.files["suratTugas"][0]
      : null;
    const suratIzinKuliah = req.files["suratIzinKuliah"]
      ? req.files["suratIzinKuliah"][0]
      : null;
    const buktiKP = req.files["buktiKP"] ? req.files["buktiKP"][0] : null;

    if (
      !transkripNilai ||
      !buktiLulus ||
      !buktiKRS ||
      !suratTugas ||
      !suratIzinKuliah ||
      !buktiKP
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Semua file harus diunggah" });
    }
    const existingRegistration = await prisma.daftarTA.findFirst({
      where: { idMahasiswa, idTA },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Mahasiswa sudah pernah mendaftar TA.",
        });
    }

    const statusTA = await prisma.tA.findFirst({
      where: { idTA, statusTA: "judul", status: "disetujui" },
    });

    if (!statusTA) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Status TA harus 'judul' dan status  harus 'disetujui' untuk dapat mendaftar.",
        });
    }
    const newDaftarTA = await prisma.daftarTA.create({
      data: {
        idMahasiswa,
        idTA,
        transkripNilai: transkripNilai.filename,
        buktiLulus: buktiLulus.filename,
        buktiKRS: buktiKRS.filename,
        suratTugas: suratTugas.filename,
        suratIzinKuliah: suratIzinKuliah.filename,
        buktiKP: buktiKP.filename,
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
};
export const editDaftarTA = async (req, res) => {
  try {
    await editdaftarTASchema.validate(req.body);

    const { idDaftarTA, idMahasiswa, idTA } = req.body;
    const transkripNilai = req.files["transkripNilai"]
      ? req.files["transkripNilai"][0]
      : null;
    const buktiLulus = req.files["buktiLulus"]
      ? req.files["buktiLulus"][0]
      : null;
    const buktiKRS = req.files["buktiKRS"] ? req.files["buktiKRS"][0] : null;
    const suratTugas = req.files["suratTugas"]
      ? req.files["suratTugas"][0]
      : null;
    const suratIzinKuliah = req.files["suratIzinKuliah"]
      ? req.files["suratIzinKuliah"][0]
      : null;
    const buktiKP = req.files["buktiKP"] ? req.files["buktiKP"][0] : null;

    if (
      !transkripNilai ||
      !buktiLulus ||
      !buktiKRS ||
      !suratTugas ||
      !suratIzinKuliah ||
      !buktiKP
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Semua file harus diunggah" });
    }

    const existingDaftarTA = await prisma.daftarTA.findUnique({
      where: { daftarTAId:idDaftarTA },
    });

    if (!existingDaftarTA) {
      return res
        .status(404)
        .json({ success: false, message: "Pendaftaran TA tidak ditemukan." });
    }

    const ta = await prisma.tA.findFirst({
      where: { idTA, status: status.ditolak, statusTA: statusTA.judul },
    });

    if (!ta) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Status TA  'ditolak' dan statusTA harus 'judul' untuk dapat mengedit pendaftaran.",
        });
    }
    const checkStatus = await prisma.daftarTA.findFirst({
      where: {
        daftarTAId: idDaftarTA,
        status: status.ditolak
      }
    });

    if(!checkStatus){
      return res
      .status(400)
      .json({
        success: false,
        message:
          "Status pendaftaran TA harus 'ditolak' untuk dapat mengedit pendaftaran.",
      });
    }

    const updatedDaftarTA = await prisma.daftarTA.update({
      where: { daftarTAId:idDaftarTA },
      data: {
        idMahasiswa,
        idTA,
        transkripNilai: transkripNilai.filename,
        buktiLulus: buktiLulus.filename,
        buktiKRS: buktiKRS.filename,
        suratTugas: suratTugas.filename,
        suratIzinKuliah: suratIzinKuliah.filename,
        buktiKP: buktiKP.filename,
        status: status.diproses,
      },
    });

    res.status(200).json({
      success: true,
      message: "Pendaftaran TA berhasil diperbarui",
      data: updatedDaftarTA,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error updating TA registration:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};

