const yup = require("yup");
const prisma = require("../../config/db");

const bidangSchema = yup.object().shape({
  namaBidang: yup.string().required("Nama Bidang is required"),
});



exports.createBidang = async (req, res) => {
  try {
    const { namaBidang } = req.body;

    await bidangSchema.validate(req.body, { abortEarly: false });

    const newBidang = await prisma.bidang.create({
      data: {
        namaBidang,
      },
    });

    res.status(201).json({ success: true, data: newBidang });
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

exports.getAllBidang = async (req, res) => {
  try {
    const bidang = await prisma.bidang.findMany();
    res.status(200).json({ success: true, data: bidang });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBidangById = async (req, res) => {
  try {
    const { id } = req.params;

    const bidang = await prisma.bidang.findUnique({
      where: { bidangId: id },
    });

    if (!bidang) {
      return res.status(404).json({ success: false, message: "Bidang not found" });
    }

    res.status(200).json({ success: true, data: bidang });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBidang = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaBidang } = req.body;

    await bidangSchema.validate(req.body, { abortEarly: false });

    const updatedBidang = await prisma.bidang.update({
      where: { bidangId: id },
      data: { namaBidang },
    });

    res.status(200).json({ success: true, data: updatedBidang });
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

exports.deleteBidang = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bidang.delete({
      where: { bidangId: id },
    });

    res.status(200).json({ success: true, message: "Bidang deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
