import express from 'express';
const router = express.Router();
import {ajukanJadwalKonsulProdi,getAllJadwalKonsulProdi,updateStatusJadwalKonsulProdi,getRiwayatKonsulProdi} from '../../controllers/mhs/konsultasiProdiController.js'
import {authenticateToken,authorizeRole} from '../../middlewares/auth.js'

router.post('/ajukanJadwalKonsul',authenticateToken,  authorizeRole('mahasiswa'),ajukanJadwalKonsulProdi)
router.get('/getAllJadwalKonsul',authenticateToken,getAllJadwalKonsulProdi)
router.get('/getRiwayatKonsul/:id',authenticateToken,getRiwayatKonsulProdi)
router.put('/updateStatusKonsul/:id',authenticateToken,authorizeRole('admin'),updateStatusJadwalKonsulProdi)


export default router;