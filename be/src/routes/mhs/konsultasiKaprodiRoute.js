const express = require('express');
const router = express.Router();
const konsulProdi = require('../../controllers/mhs/konsultasiProdiController')
const md = require('../../middlewares/auth')

router.post('/ajukanKonsultasiKaprodi',md.authorizeRole('mahasiswa'),md.authenticateToken,konsulProdi.ajukanJadwalKonsulProdi)
router.get('/getAllJadwalKonsultasi',md.authorizeRole('mahasiswa'),md.authenticateToken,konsulProdi.getAllJadwalKonsulProdi)


module.exports = router;
