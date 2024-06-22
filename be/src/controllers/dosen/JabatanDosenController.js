import prisma from '../../config/db.js';
import * as yup from 'yup';

const jabatanSchema = yup.object().shape({
  namaJabatan: yup.string().required("Nama Jabatan is required"),
});

export const createJabatan = async (req, res) => {
    try {
      const { namaJabatan } = req.body;
  
      await jabatanSchema.validate(req.body, { abortEarly: false });
  
      const newJabatan = await prisma.jabatan.create({
        data: {
          namaJabatan,
        },
      });
  
      res.status(201).json({ success: true, data: newJabatan });
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
  
  export const getAllJabatan = async (req, res) => {
    try {
      const jabatan = await prisma.jabatan.findMany();
      res.status(200).json({ success: true, data: jabatan });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const getJabatanById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const jabatan = await prisma.jabatan.findUnique({
        where: { jabatanId: id },
      });
  
      if (!jabatan) {
        return res.status(404).json({ success: false, message: "Jabatan not found" });
      }
  
      res.status(200).json({ success: true, data: jabatan });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const updateJabatan = async (req, res) => {
    try {
      const { id } = req.params;
      const { namaJabatan } = req.body;
  
      await jabatanSchema.validate(req.body, { abortEarly: false });
  
      const updatedJabatan = await prisma.jabatan.update({
        where: { jabatanId: id },
        data: { namaJabatan },
      });
  
      res.status(200).json({ success: true, data: updatedJabatan });
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
  
  export const deleteJabatan = async (req, res) => {
    try {
      const { id } = req.params;
  
      await prisma.jabatan.delete({
        where: { jabatanId: id },
      });
  
      res.status(200).json({ success: true, message: "Jabatan deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };