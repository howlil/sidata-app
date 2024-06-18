import * as yup from "yup";
import prisma from "../../config/db.js";

const dokumenSchema = yup.object().shape({
  adminId: yup.string().required("Admin ID is required"),
  judulDokumen: yup.string().required("Judul Dokumen is required"),
});

export const createDokumen = async (req, res) => {
  try {
    const { adminId, judulDokumen } = req.body;

    await dokumenSchema.validate(req.body, { abortEarly: false });

    const newDokumen = await prisma.dokumen.create({
      data: {
        adminId,
        judulDokumen,
      },
    });

    res.status(201).json({ success: true, data: newDokumen });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDokumen = async (req, res) => {
  try {
    const dokumen = await prisma.dokumen.findMany();
    res.status(200).json({ success: true, data: dokumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDokumenById = async (req, res) => {
  try {
    const { id } = req.params;

    const dokumen = await prisma.dokumen.findUnique({
      where: { dokumenId: id },
    });

    if (!dokumen) {
      return res
        .status(404)
        .json({ success: false, message: "Dokumen not found" });
    }

    res.status(200).json({ success: true, data: dokumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, judulDokumen } = req.body;

    await dokumenSchema.validate(req.body, { abortEarly: false });

    const updatedDokumen = await prisma.dokumen.update({
      where: { dokumenId: id },
      data: { adminId, judulDokumen },
    });

    res.status(200).json({ success: true, data: updatedDokumen });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.dokumen.delete({
      where: { dokumenId: id },
    });

    res
      .status(200)
      .json({ success: true, message: "Dokumen deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
