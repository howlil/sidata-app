import prisma from "../../config/db.js";
import bcrypt from "bcrypt";
import * as yup from "yup";
import { tipeDosen } from "../../config/typeEnum.js";

const createMahasiswaSchema = yup.object().shape({
  nama: yup.string().required("Nama is required"),
  nim: yup.string().required("NIM is required").length(10, `NIM harus 10 karakter`),
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
  nip: yup.string().required("NIP is required").length(18, `NIP harus 18 karakter`),
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
    .of(
      yup.object().shape({
        bidangId: yup.string().required("Bidang ID is required"),
      })
    )
    .min(1, "Minimal satu bidang dosen")
    .max(2, "Maksimal dua bidang dosen"),
});

const editMahasiswaSchema = yup.object().shape({
  nama: yup.string().optional(),
  nim: yup.string().optional().length(10, `NIM harus 10 karakter`),
  email: yup
    .string()
    .email("Invalid email format")
    .optional()
    .matches(/@student\.id$/, "Email harus diakhiri @student.id"),
  alamat: yup.string().optional(),
});

const editDosenSchema = yup.object().shape({
  nama: yup.string().optional(),
  nip: yup.string().optional().length(18, `NIP harus 18 karakter`),
  email: yup
    .string()
    .email("Invalid email format")
    .optional()
    .matches(/@dosen\.id$/, "Email harus diakhiri @dosen.id"),
  jabatanId: yup.string().optional(),
  bidangDosen: yup
    .array()
    .of(yup.string().required("Bidang Dosen is required"))
    .min(1, "Minimal satu bidang dosen")
    .max(2, "Maksimal dua bidang dosen"),
});


export const buatAkunMahasiswa = async (req, res) => {
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
      .json({
        success: true,
        message: "Akun Mahasiswa Berhasil dibuat",
        data: mahasiswaData,
      });
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
      .json({ message: "Error saat membuat akun", error: error.message });
  }
};

export const buatAkunDosen = async (req, res) => {
  try {
    const { nama, nip, email, password, jabatanId, bidangDosen } = req.body;

    await createDosenSchema.validate(req.body, { abortEarly: false });

    const existingDosen = await prisma.dosen.findFirst({
      where: {
        OR: [{ email }, { nip }],
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
          create: bidangDosen.map(({ bidangId }) => ({
            bidangId,
          })),
        },
      },
      include: {
        BidangDosen: true,
      },
    });

    try {
      const jabatan = await prisma.jabatan.findUnique({
        where: { jabatanId: dosen.jabatanId },
      });
      if (!jabatan) {
        return res.status(404).json({
          success: false,
          message: "Jabatan tidak ditemukan",
        });
      }
    
      let pembimbingTypes = [];
      if (jabatan.namaJabatan === "Asisten Ahli") {
        pembimbingTypes.push(tipeDosen.utama, tipeDosen.asisten);
      } else if (jabatan.namaJabatan === "Lektor" || jabatan.namaJabatan === "Lektor Kepala") {
        pembimbingTypes.push(tipeDosen.utama, tipeDosen.asisten);
      } else if (jabatan.namaJabatan === "Profesor") {
        pembimbingTypes.push(tipeDosen.utama);
      }
    
      console.log("Pembimbing types: ", pembimbingTypes);
    
      const pembimbingPromises = pembimbingTypes.map((type) =>
        prisma.dosenPembimbing.create({
          data: {
            dosenId: dosen.idDosen,
            tipePembimbing: type,
          },
        })
      );
    
      await Promise.all(pembimbingPromises);
    
      const { password, ...dosenData } = dosen;
    
      res.status(201).json({
        success: true,
        message: "Akun Dosen Berhasil dibuat",
        data: dosenData,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("Unhandled error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(400).json({
      success: false,
      message: "Error saat membuat akun",
      error: error.message,
    });
  }
};

export const getAllAkunMhs = async (req, res) => {
  try {
    const data = await prisma.mahasiswa.findMany();
    if (data.length === 0) res.status(400).json({ message: "tidak ada data" });
    console.log(data);
    res
      .status(200)
      .json({ success: true, message: "data berhasil diambil", data: data });
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
      .send({
        success: false,
        message: "Error saat membuat akun",
        error: error.message,
      });
  }
};

export const akunMhsById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.mahasiswa.findUnique({
      where: {
        idMahasiswa: id,
      },
    });
    if (!data)
      res.status(400).json({ success: true, message: "akun tidak ditemukan" });

    res
      .status(200)
      .json({ success: true, message: "akun ditemukna", data: data });
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
      .json({
        success: false,
        message: "Error saat membuat akun",
        error: error.message,
      });
  }
};

export const akunDosenById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.dosen.findUnique({
      where: {
        idDosen: id,
      },
      include: {
        BidangDosen: true,
        DosenPembimbing: true,
      }
    });
    if (!data)
      res.status(400).json({ success: false, message: "akun tidak ditemukan" });

    res
      .status(200)
      .json({ success: true, message: "akun ditemukna", data: data });
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

export const getAllAkunDosen = async (req, res) => {
  try {
    const data = await prisma.dosen.findMany();
    console.log(data);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "tidak ada data" });
    }

    res.status(200).json({ success: true, message: "data berhasil diambil", data: data });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    return res.status(500).send({ message: "Error saat membuat akun", error: error.message }); 
  }
};

export const editAkunMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, nim, email, password, alamat } = req.body;

    await editMahasiswaSchema.validate(req.body, { abortEarly: false });

    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { idMahasiswa: id },
    });

    if (!existingMahasiswa) {
      return res.status(404).json({
        success: false,
        message: "Akun mahasiswa tidak ditemukan",
      });
    }

    const duplicateCheck = await prisma.mahasiswa.findFirst({
      where: {
        OR: [
          { nim, NOT: { idMahasiswa: id } },
          { email, NOT: { idMahasiswa: id } }
        ],
      },
    });

    if (duplicateCheck) {
      return res.status(400).json({
        success: false,
        message: "NIM atau Email sudah digunakan oleh akun lain.",
      });
    }

    const updateData = {
      nama,
      nim,
      email,
      alamat,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedMahasiswa = await prisma.mahasiswa.update({
      where: { idMahasiswa: id },
      data: updateData,
    });

    const { password: _, ...mahasiswaData } = updatedMahasiswa;

    res.status(200).json({
      success: true,
      message: "Akun mahasiswa berhasil diperbarui",
      data: mahasiswaData,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(400).send({
      message: "Error saat memperbarui akun mahasiswa",
      error: error.message,
    });
  }
};


export const editAkunDosen = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, nip, email, password, jabatanId, BidangDosen } = req.body;

    await editDosenSchema.validate(req.body, { abortEarly: false });

    const existingDosen = await prisma.dosen.findUnique({
      where: { idDosen: id },
    });

    if (!existingDosen) {
      return res.status(404).json({
        success: false,
        message: "Akun dosen tidak ditemukan",
      });
    }
    const conflictingDosen = await prisma.dosen.findFirst({
      where: {
        OR: [
          { nip, NOT: { idDosen: id } },
          { email, NOT: { idDosen: id } }
        ],
      },
    });
    
    if (conflictingDosen) {
      const conflictField = conflictingDosen.nip === nip ? 'NIP' : 'email';
      return res.status(400).json({
        success: false,
        message: `${conflictField} sudah digunakan.`,
      });
    }

    const updateData = {
      nama,
      nip,
      email,
      password,
      jabatanId,
    };
    
    if (!Array.isArray(BidangDosen)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input for bidangDosen, expected an array",
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedDosen = await prisma.dosen.update({
      where: { idDosen: id },
      data: {
        ...updateData,
        BidangDosen: {
          deleteMany: {},
          create: BidangDosen.map(({ bidangId }) => ({
            bidangId,
          })),
        },
      },
      include: {
        BidangDosen: true,
      },
    });

    const { password: _, ...dosenData } = updatedDosen;

    res.status(200).send({
      success: true,
      message: "Akun dosen berhasil diperbarui",
      data: dosenData,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(400).send({
      message: "Error saat memperbarui akun dosen",
      error: error.message,
    });
  }
};


export const getDosenByBidang = async (req, res) => {
  try {
    const { bidangId } = req.params;

    if (!bidangId) {
      return res.status(400).json({
        success: false,
        message: "Bidang ID diperlukan",
      });
    }

    const bidangDosen = await prisma.bidangDosen.findMany({
      where: {
        bidangId: bidangId,
      },
      include: {
        Bidang: true, 
        Dosen: true   
      }
    });

    if (bidangDosen.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada dosen ditemukan untuk bidang ini",
      });
    }

    const dosenList = bidangDosen.map((bd) => bd.Dosen);

    res.status(200).json({
      success: true,
      data: dosenList,
    });
  } catch (error) {
    console.error("Error fetching dosen by bidang:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};


export const getAllDosenPembimbing = async (req, res) => {
  try {
    const dosenPembimbingList = await prisma.dosenPembimbing.findMany({
      include: {
        Dosen: true, 
      },
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua akun dosen pembimbing",
      data: dosenPembimbingList,
    });
  } catch (error) {
    console.error("Error fetching all dosen pembimbing:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};

export const getDosenPembimbingByBidang = async (req, res) => {
  try {
    const { bidangId } = req.params; 

    const dosenPembimbingList = await prisma.dosenPembimbing.findMany({
      where: {
        Dosen: {
          BidangDosen: {
            some: {
              bidangId: bidangId,
            },
          },
        },
      },
      include: {
        Dosen: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil dosen pembimbing berdasarkan bidang",
      data: dosenPembimbingList,
    });
  } catch (error) {
    console.error("Error fetching dosen pembimbing by bidang:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server: " + error.message,
    });
  }
};

export const getDosenPembimbingId  = async(req,res)=>{
  const {dosenId,tipePembimbing,jabatanId} = req.body
  try {
    const dosenPembimbing = await prisma.dosenPembimbing.findFirst({
      where:{
        dosenId,
        tipePembimbing,
        Dosen:{
          jabatanId
        }
      }
    })
    if(!dosenPembimbing){
      return res.status(404).json({
        success:false,
        message:"Dosen pembimbing tidak ditemukan"
      })
    }
    res.status(200).json({
      success:true,
      message:"Dosen pembimbing ditemukan",
      data:dosenPembimbing
    })
  } catch (error) {
   console.error("Error fetching dosen pembimbing by id:", error);
  }

}