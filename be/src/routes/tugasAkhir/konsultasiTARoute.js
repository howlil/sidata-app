const express = require('express');
const router = express.Router();
const {ajukanJadwalKonsulProdi,getAllJadwalKonsulProdi} = require('../../controllers/mhs/konsultasiProdiController')
const {authenticateToken,authorizeRole} = require('../../middlewares/auth')

router.post('/ajukanKonsultasiKaprodi',authorizeRole('mahasiswa'),authenticateToken,ajukanJadwalKonsulProdi)
router.get('/getAllJadwalKonsultasi',authorizeRole('mahasiswa'),authenticateToken,getAllJadwalKonsulProdi)


module.exports = router;
