const prisma = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.buatkAkun = async (req, res) => {
  try {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ success: false, message: "Isi semua Input" });
  }

  let role;
  if (email.endsWith("@student.ac.id")) {
    role = "Mahasiswa";
  } else if (email.endsWith("@dosen.ac.id")) {
    role = "Dosen";
  } else if (email.endsWith("@admin.ac.id")) {
    role = "Admin";
  } else {
    return res.status(400).json({
      success: false,
      message: "Email harus diakhir dengan @student.ac.id atau @dosen.ac.id ",
    });
  }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Akun dengan email ini sudah ada" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role,
      },
    });
    const { password: _, ...userData } = user;
    res.status(201).send({ message: "Akun Berhasil dibuat", data: userData });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Eror saat membuat akun", error: error.message });
  }
};



exports.logout = async (req,res) => {
  try {
       const authHeader = req.get('Authorization');
      
       if (!authHeader) {
           return res.status(401).json({ succes: false, message: 'Tidak ada token atau sudah logout sebelumnya' });
       }

       const token = authHeader.split(' ')[1];

       jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
           if (err) {
             return res.status(401).json({ succes: false, message: err });
           }

           const adaToken = await prisma.token.findUnique({where: {token}})
           if (!adaToken) {
               return res.status(401).json({ succes: false, message: "Tidak ada token atau sudah logout sebelumnya" });
           }
           
           await prisma.token.delete({ where: {token}});
       
           res.status(200).json({ success: true, message: 'Logout berhasil' });
       });
  } catch (error) {
      console.log(error)
      return res.status(500).json({success: false, message: 'Kesalahan server'})
  }
}
