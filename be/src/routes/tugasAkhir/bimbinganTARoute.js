import express from 'express';
const router = express.Router();
import { ajukanJadwalBimbingan, getAllJadwalBimbingan } from '../../controllers/mhs/bimbinganDosenController.js';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.js';

router.post('/ajukanBimbinganTA', authorizeRole('mahasiswa'), authenticateToken, ajukanJadwalBimbingan);
router.post('/getJadwalBimbinganTA', authorizeRole('mahasiswa'), authenticateToken, getAllJadwalBimbingan);

export default router;