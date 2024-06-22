import prisma from "../../config/db.js";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getUserById = async (req, res) => {
  try {
    const id = req.user.userId;
    const role = req.user.role;

    if (!id || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID atau role tidak tersedia dalam token",
      });
    }

    let user;
    if (role === "mahasiswa") {
      user = await prisma.mahasiswa.findUnique({ where: {idMahasiswa: id } });
    } else if (role === "dosen") {
      user = await prisma.dosen.findUnique({ where: {idDosen: id } });
    } else if (role === "admin") {
      user = await prisma.admin.findUnique({ where: {adminId: id } });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `${role} tidak ditemukan` });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(`Error fetching  data:`, error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "foto") {
      cb(null, path.join(__dirname, "../../../public/images/profile"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.fieldname === "foto") {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
      error.message =
        "Jenis File Tidak Diizinkan, Hanya JPEG dan PNG yang Diizinkan";
      return cb(error, false);
    }
  } else {
    cb(new Error("Invalid field name"), false);
  }
  cb(null, true);
};

export const uploadFoto = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("foto");

export const editUserProfile = async (req, res) => {
  
  const id = req.user.userId;
  const role = req.user.role.toLowerCase(); 
  const { nama, email, alamat } = req.body;
  try {

    const user = await prisma[role].findUnique({ where: { id } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    let foto;
    if (req.file) {
      foto = req.file.filename;
    }

    const updateData = { nama,email, alamat, noHp };
    if (foto) {
      updateData.foto = foto;
    }

    const updatedUser = await prisma[role].update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};


