import express from 'express';
const router = express.Router();
import {ajukanJadwalKonsulProdi} from '../../controllers/mhs/konsultasiProdiController.js'
import {authenticateToken,authorizeRole} from '../../middlewares/auth.js'

router.post('/ajukanJadwalKonsul',ajukanJadwalKonsulProdi)

export default router;