import express from "express";
const router = express.Router();
import { authenticateToken } from "../../middlewares/auth.js";
import { getJumlahDosen,getJumlahMahasiswa,getJumlahTAterdaftar,getMahasiswaBimbingan } from "../../controllers/dashboard/dashboard.js";

router.get('/jumlahDosen', authenticateToken, getJumlahDosen);
router.get('/jumlahMahasiswa', authenticateToken, getJumlahMahasiswa);
router.get('/jumlahTAterdaftar', authenticateToken, getJumlahTAterdaftar);
router.get('/mahasiswaBimbingan/:dosenPembimbingID', authenticateToken, getMahasiswaBimbingan);

export default router;

