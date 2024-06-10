const prisma = require('../../config/db')
const yup = require('yup')

const ajukanJadwalKonsulProdiSchema = yup.object().shape({
    idMahasiswa: yup.string().required("ID Mahasiswa wajib diisi"),
    kendala: yup.string().required("Kendala wajib diisi"),
    tanggal: yup.date().required("Tanggal wajib diisi"),
    waktuMulai: yup.date().required("Waktu mulai wajib diisi"),
    waktuSelesai: yup.date().required("Waktu selesai wajib diisi")
});

exports.ajukanJadwalKonsulProdi = async (req, res) => {
    try {
        await ajukanJadwalKonsulProdiSchema.validate(req.body);

        const { idMahasiswa, kendala, tanggal, waktuMulai, waktuSelesai } = req.body;

        const newJadwalKonsulProdi = await prisma.jadwalKonsulProdi.create({
            data: {
                idMahasiswa,
                kendala,
                tanggal,
                waktuMulai,
                waktuSelesai,
                status: 'diproses'
            }
        });

        res.status(201).json({
            success: true,
            message: "Pengajuan jadwal konsultasi prodi berhasil",
            data: newJadwalKonsulProdi
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ success: false, message: error.errors.join(", ") });
        }
        console.error("Error submitting schedule:", error);
        res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
    }
};

exports.getAllJadwalKonsulProdi = async (req, res) => {
    try {
        const allJadwalKonsulProdi = await prisma.jadwalKonsulProdi.findMany({
            include: {
                Mahasiswa: true,
                Admin: true
            }
        });
        if (allJadwalKonsulProdi.length === 0) {
            return res.status(404).json({
                success: false,
                message:"tidak ada data"
            })
        }

        res.status(200).json({
            success: true,
            data: allJadwalKonsulProdi
        });
    } catch (error) {
        console.error("Error retrieving schedules:", error);
        res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
    }
};
