const yup = require("yup");
const status = require("../../config/typeEnum");
const prisma = require("../../config/db");
const accJadwalKonsulProdiSchema = yup.object().shape({
    idJadwal: yup.string().required("ID Jadwal wajib diisi"),
    isApproved: yup.boolean().required("Status persetujuan wajib diisi")
});

exports.accJadwalKonsulProdi = async (req, res) => {
    try {
        await accJadwalKonsulProdiSchema.validate(req.body);

        const { idJadwal, isApproved } = req.body;

        const existingJadwal = await prisma.jadwalKonsulProdi.findUnique({
            where: { id: idJadwal },
            include: {
                Mahasiswa: true,
                Admin: true
            }
        });

        if (!existingJadwal) {
            return res.status(404).json({ success: false, message: "Jadwal konsultasi tidak ditemukan" });
        }

        const updatedJadwal = await prisma.jadwalKonsulProdi.update({
            where: { id: idJadwal },
            data: {
                status: isApproved ? 'diterima' : 'ditolak'
            },
            include: {
                Mahasiswa: true,
                Admin: true
            }
        });

        res.status(200).json({
            success: true,
            message: `Jadwal konsultasi ${isApproved ? "disetujui" : "ditolak"} oleh admin`,
            data: updatedJadwal
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ success: false, message: error.errors.join(", ") });
        }
        console.error("Error approving/rejecting schedule:", error);
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
                message: "Tidak ada data"
            });
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
exports.getDetailJadwalKonsulProdi = async (req, res) => {
    const { idJadwal } = req.params;

    try {
        const jadwalKonsulProdi = await prisma.jadwalKonsulProdi.findUnique({
            where: { id: idJadwal },
            include: {
                Mahasiswa: true,
                Admin: true
            }
        });

        if (!jadwalKonsulProdi) {
            return res.status(404).json({
                success: false,
                message: "Jadwal konsultasi tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            data: jadwalKonsulProdi
        });
    } catch (error) {
        console.error("Error retrieving schedule detail:", error);
        res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
    }
};
