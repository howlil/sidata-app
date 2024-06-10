const prisma = require('../../config/db')
const yup = require('yup')


const ajukanJadwalBimbinganSchema = yup.object().shape({
    idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
    dosPembimbingId: yup.string().required("ID Dosen Pembimbing wajib diisi"),
    kendala: yup.string().required("Kendala wajib diisi"),
    progresTA: yup.string().required("Progres TA wajib diisi"),
    tanggal: yup.date().required("Tanggal wajib diisi"),
    waktuMulai: yup.date().required("Waktu mulai wajib diisi"),
    waktuSelesai: yup.date().required("Waktu selesai wajib diisi")
});


exports.ajukanJadwalBimbingan = async (req, res) => {
    try {
        await ajukanJadwalBimbinganSchema.validate(req.body);

        const { idMahasiswa, dosPembimbingId, kendala, progresTA, tanggal, waktuMulai, waktuSelesai } = req.body;

        const newJadwalBimbingan = await prisma.jadwalBimbinganDosen.create({
            data: {
                idMahasiswa,
                dosPembimbingId,
                kendala,
                progresTA,
                tanggal,
                waktuMulai,
                waktuSelesai,
                status: 'diproses'
            }
        });

        res.status(201).json({
            success: true,
            message: "Pengajuan jadwal bimbingan berhasil",
            data: newJadwalBimbingan
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ success: false, message: error.errors.join(", ") });
        }
        console.error("Error submitting schedule:", error);
        res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
    }
};


exports.getAllJadwalBimbingan = async (req, res) => {
    try {
        const allJadwalBimbingan = await prisma.jadwalBimbinganDosen.findMany({
            include: {
                Mahasiswa: true,
                DosenPembimbing: {
                    include: {
                        Dosen: true
                    }
                }
            }
        });
        if(allJadwalBimbingan.length===0){
            res.status(404).json({
                success: false,
                message: " Jadwal Bimbingan tidak ada",
            })
        }

        res.status(200).json({
            success: true,
            data: allJadwalBimbingan
        });
    } catch (error) {
        console.error("Error retrieving schedules:", error);
        res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
    }
};
