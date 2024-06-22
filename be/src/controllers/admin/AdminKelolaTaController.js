import prisma from "../../config/db.js";
import { status, statusTA } from '../../config/typeEnum.js';
 import * as yup from "yup";

const accDaftarTASchema = yup.object().shape({
    idDaftarTA: yup.string().required("ID Daftar TA wajib diisi"),
    isApproved: yup.boolean().required("Status persetujuan wajib diisi"),
});

export const accDaftarTA = async (req, res) => {
    try {
        await accDaftarTASchema.validate(req.body);

        const { idDaftarTA, isApproved } = req.body;

        const existingDaftarTA = await prisma.daftarTA.findUnique({ where: {daftarTAId: idDaftarTA } });
        if (!existingDaftarTA) {
            return res.status(404).json({ success: false, message: "Pendaftaran TA tidak ditemukan" });
        }

        const updatedDaftarTA = await prisma.daftarTA.update({
            where: { daftarTAId: idDaftarTA},
            data: {
                status: isApproved ? status.disetujui : status.ditolak,
            },
        });

        if (isApproved === status.disetujui && existingDaftarTA.statusTA === statusTA.judul) {
            await prisma.tA.update({
                where: { idTA: existingDaftarTA.idTA },
                data: {
                    statusTA: statusTA.proposal,
                    status: status.disetujui,
                },
            });
        }else{
            await prisma.tA.update({
                where: { idTA: existingDaftarTA.idTA },
                data: {
                    statusTA: statusTA.judul,
                    status: status.ditolak,
                },
            });
        }

        res.status(200).json({
            success: true,
            message: `Pendaftaran TA berhasil`,
            data: updatedDaftarTA,
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res
                .status(400)
                .json({ success: false, message: error.errors.join(", ") });
        }
        console.error("Error approving/rejecting TA registration:", error);
        res.status(500).json({
            success: false,
            message: "Kesalahan server: " + error.message,
        });
    }
};