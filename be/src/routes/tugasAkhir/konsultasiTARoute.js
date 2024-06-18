import express from 'express';
const router = express.Router();
import { ajukanJadwalKonsulProdi, getAllJadwalKonsulProdi } from '../../controllers/mhs/konsultasiProdiController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.js';

router.post('/ajukanKonsultasiKaprodi', authorizeRole('mahasiswa'), authenticateToken, ajukanJadwalKonsulProdi);
router.get('/getAllJadwalKonsultasi', authorizeRole('mahasiswa'), authenticateToken, getAllJadwalKonsulProdi);

export default router;