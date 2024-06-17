const prisma = require("../../config/db");
const bcrypt = require("bcrypt");
const yup = require("yup");

const createMahasiswaSchema = yup.object().shape({
  nama: yup.string().required("Nama is required"),
  nim: yup.string().required("NIM is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/@student\.id$/, "Email harus diakhiri @admin.com"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password Harus 6 karakter"),
  alamat: yup.string().required("Alamat is required"),
});

const createDosenSchema = yup.object().shape({
  nama: yup.string().required("Nama is required"),
  nip: yup.string().required("NIP is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/@dosen\.id$/, "Email harus diakhiri @dosen.id"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password Harus 6 karakter"),
  jabatanId: yup.string().required("Jabatan is required"),
  bidangDosen: yup
    .array()
    .of(yup.string().required("Bidang Dosen is required"))
    .min(1, "Minimal satu bidang dosen")
    .max(3, "Maksimal tiga bidang dosen"),
});
exports.buatAkunMahasiswa = async (req, res) => {
  try {
    const { nama, nim, email, password, alamat } = req.body;

    await createMahasiswaSchema.validate(req.body, { abortEarly: false });

    const existingMahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        OR: [{ nim }, { email }],
      },
    });

    if (existingMahasiswa) {
      return res.status(400).json({
        success: false,
        message: "Nama, NIM, atau Email sudah ada",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mahasiswa = await prisma.mahasiswa.create({
      data: {
        nama,
        nim,
        email,
        password: hashedPassword,
        alamat,
      },
    });

    const { password: _, ...mahasiswaData } = mahasiswa;

    res
      .status(201)
      .send({ message: "Akun Mahasiswa Berhasil dibuat", data: mahasiswaData });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res
      .status(400)
      .send({ message: "Error saat membuat akun", error: error.message });
  }
};


exports.buatAkunDosen = async (req, res) => {
  try {
    const { nama, nip, email, password, jabatanId, bidangDosen } = req.body;

    await createDosenSchema.validate(req.body, { abortEarly: false });

    const existingDosen = await prisma.dosen.findFirst({
      where: {
        OR: [
          { email },
          { nip },
        ],
      },
    });

    if (existingDosen) {
      return res.status(400).json({
        success: false,
        message: "Email atau NIP sudah ada",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dosen = await prisma.dosen.create({
      data: {
        nama,
        nip,
        email,
        password: hashedPassword,
        jabatanId,
        BidangDosen: {
          create: bidangDosen.map(bidang => ({ bidang })),
        },
      },
      include: {
        BidangDosen: true,
      },
    });

    const { password: _, ...dosenData } = dosen;

    res.status(201).send({ message: "Akun Dosen Berhasil dibuat", data: dosenData });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res
      .status(400)
      .send({ message: "Error saat membuat akun", error: error.message });
  }
};
