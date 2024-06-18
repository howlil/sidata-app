import prisma from "../../config/db.js";
import { status, statusTA, tipePembimbing } from "../../config/typeEnum";
exports.accIdeTA = async (req, res) => {
  try {
    const { idTA, isApproved, dosenId } = req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idTA } });
    if (!existingTA) {
      return res
        .status(404)
        .json({ success: false, message: "TA tidak ditemukan" });
    }

    const advisor = await prisma.dosen.findUnique({
      where: { idDosen: dosenId },
    });
    if (!advisor) {
      return res
        .status(404)
        .json({ success: false, message: "Dosen tidak ditemukan" });
    }

    const advisorApproval = await prisma.dosenPembimbingTA.updateMany({
      where: {
        idTA,
        dosenPembimbinID: dosenId,
      },
      data: {
        approved: isApproved ? status.diterima : status.ditolak,
      },
    });

    if (!advisorApproval) {
      return res
        .status(404)
        .json({ success: false, message: "Pembimbing tidak ditemukan" });
    }

    // Check if any advisor has rejected the TA idea
    const anyRejected = await prisma.dosenPembimbingTA.findMany({
      where: {
        idTA,
        approved: status.ditolak,
      },
    });

    if (anyRejected.length > 0) {
      const updatedTA = await prisma.tA.update({
        where: { idTA },
        data: {
          status: status.ditolak,
          statusTA: statusTA.ide,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Ide TA ditolak oleh salah satu atau kedua pembimbing",
        data: updatedTA,
      });
    }

    // Check if all advisors have approved the TA idea
    const allApproved = await prisma.dosenPembimbingTA.findMany({
      where: {
        idTA,
        approved: status.diterima,
      },
    });

    const totalAdvisors = await prisma.dosenPembimbingTA.count({
      where: { idTA },
    });

    if (allApproved.length === totalAdvisors) {
      const updatedTA = await prisma.tA.update({
        where: { idTA },
        data: {
          status: status.diterima,
          statusTA: statusTA.ide,
        },
      });

      if (allApproved.length === 2) {
        await prisma.dosenPembimbing.update({
          where: { id: allApproved[0].id },
          data: { tipePembimbing: tipePembimbing.utama },
        });

        await prisma.dosenPembimbing.update({
          where: { id: allApproved[1].id },
          data: { tipePembimbing: tipePembimbing.asisten },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Ide TA disetujui oleh semua pembimbing",
        data: updatedTA,
      });
    }

    res.status(200).json({
      success: true,
      message: `Ide TA ${isApproved ? "disetujui" : "ditolak"} oleh pembimbing`,
    });
  } catch (error) {
    console.error("Error approving/rejecting TA idea:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};

exports.accJudulTA = async (req, res) => {
  try {
    const { idTA, isApproved, dosenId } = req.body;

    const existingTA = await prisma.tA.findUnique({ where: { idTA } });
    if (!existingTA) {
      return res
        .status(404)
        .json({ success: false, message: "TA tidak ditemukan" });
    }

    const advisor = await prisma.dosen.findUnique({
      where: { idDosen: dosenId },
    });
    if (!advisor) {
      return res
        .status(404)
        .json({ success: false, message: "Dosen tidak ditemukan" });
    }

    const advisorApproval = await prisma.dosenPembimbingTA.updateMany({
      where: {
        idTA,
        dosenPembimbinID: dosenId,
      },
      data: {
        approved: isApproved ? status.diterima : status.ditolak,
      },
    });

    if (!advisorApproval) {
      return res
        .status(404)
        .json({ success: false, message: "Pembimbing tidak ditemukan" });
    }

    // Check if any advisor has rejected the TA title
    const anyRejected = await prisma.dosenPembimbingTA.findMany({
      where: {
        idTA,
        approved: status.ditolak,
      },
    });

    if (anyRejected.length > 0) {
      const updatedTA = await prisma.tA.update({
        where: { idTA },
        data: {
          status: status.ditolak,
          statusTA: statusTA.judul,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Judul TA ditolak oleh salah satu atau kedua pembimbing",
        data: updatedTA,
      });
    }

    // Check if all advisors have approved the TA title
    const allApproved = await prisma.dosenPembimbingTA.findMany({
      where: {
        idTA,
        approved: status.diterima,
      },
    });

    const totalAdvisors = await prisma.dosenPembimbingTA.count({
      where: { idTA },
    });

    if (allApproved.length === totalAdvisors) {
      const updatedTA = await prisma.tA.update({
        where: { idTA },
        data: {
          status: status.diterima,
          statusTA: statusTA.judul,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Judul TA disetujui oleh semua pembimbing",
        data: updatedTA,
      });
    }

    res.status(200).json({
      success: true,
      message: `Judul TA ${
        isApproved ? "disetujui" : "ditolak"
      } oleh pembimbing`,
    });
  } catch (error) {
    console.error("Error approving/rejecting TA title:", error);
    res
      .status(500)
      .json({ success: false, message: "Kesalahan server: " + error.message });
  }
};
