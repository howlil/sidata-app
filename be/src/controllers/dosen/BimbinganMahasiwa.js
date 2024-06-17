const yup = require("yup");
const prisma = require("../../config/db");
const status = require("../../config/typeEnum");

const accJadwalBimbinganSchema = yup.object().shape({
    idJadwal: yup.string().required("ID Jadwal wajib diisi"),
    isApproved: yup.boolean().required("Status persetujuan wajib diisi")
});

exports.accJadwalBimbingan = async (req, res) => {
    try {
        await accJadwalBimbinganSchema.validate(req.body);

        const { idJadwal, isApproved } = req.body;

        const existingJadwal = await prisma.jadwalBimbinganDosen.findUnique({
            where: { id: idJadwal },
            include: {
                Mahasiswa: true,
                DosenPembimbing: {
                    include: {
                        Dosen: true
                    }
                }
            }
        });

        if (!existingJadwal) {
            return res.status(404).json({ success: false, message: "Jadwal bimbingan tidak ditemukan" });
        }

        const updatedJadwal = await prisma.jadwalBimbinganDosen.update({
            where: { id: idJadwal },
            data: {
                status: isApproved ? status.diterima : status.ditolak
            },
            include: {
                Mahasiswa: true,
                DosenPembimbing: {
                    include: {
                        Dosen: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: `Jadwal bimbingan ${isApproved ? "disetujui" : "ditolak"} oleh dosen pembimbing`,
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

exports.getJadwalBimbinganByDosen = async (req, res) => {
    const { idDosen } = req.params;

    try {
        const jadwalBimbingan = await prisma.jadwalBimbinganDosen.findMany({
            where: {
                DosenPembimbing: {
                    dosenId: idDosen
                }
            },
            include: {
                Mahasiswa: true,
                DosenPembimbing: {
                    include: {
                        Dosen: true
                    }
                }
            }
        });

        if (jadwalBimbingan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada jadwal bimbingan untuk dosen ini",
            });
        }

        res.status(200).json({
            success: true,
            data: jadwalBimbingan
        });
    } catch (error) {
        console.error("Error retrieving mentoring schedules:", error);
        res.status(500).json({ success: false, message: "Kesalahan server: " + error.message });
    }
};
