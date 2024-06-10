import prisma from "../../config/db";
import * as yup from "yup";
import bcrypt from "bcrypt";

const schema = yup.object().shape({
  nama: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  nim: yup.string().required(),
  alamat: yup.string().required(),
});

exports.buatAkunMahasiswa = async (req, res) => {
  try {
    await schema.validate(req.body);

    const { nama, email, password, nim, alamat } = req.body;

    const role = "mahasiswa";

    const existingUser = await prisma[role].findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Akun dengan email ini sudah ada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma[role].create({
      data: {
        nama,
        email,
        password: hashedPassword,
        nim,
        alamat,
        role: role.toUpperCase(),
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Akun berhasil dibuat", data: newUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

const yup = require("yup");

const dosenSchema = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  nip: yup.string().required("NIP wajib diisi"),
  kuotaMhdBimbingan: yup.number().nullable(),
  jabatanId: yup.string().required("Jabatan ID wajib diisi"),
  bidangIds: yup
    .array()
    .of(yup.string().required("Bidang ID wajib diisi"))
    .required("Bidang wajib diisi"),
});

exports.buatAkunDosen = async (req, res) => {
  try {
    await dosenSchema.validate(req.body);

    const {
      nama,
      email,
      password,
      nip,
      kuotaMhdBimbingan,
      jabatanId,
      bidangIds,
    } = req.body;

    const existingUser = await prisma.dosen.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Akun dengan email ini sudah ada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDosen = await prisma.dosen.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        nip,
        kuotaMhdBimbingan,
        jabatanId,
        BidangDosen: {
          create: bidangIds.map((bidangId) => ({
            bidangId,
          })),
        },
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Akun Dosen berhasil dibuat",
        data: newDosen,
      });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors.join(", ") });
    }
    console.error("Error creating Dosen account:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};
