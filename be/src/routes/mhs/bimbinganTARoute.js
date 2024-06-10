const express = require('express');
const router = express.Router();
const bimbinganTA = require('../../controllers/mhs/bimbinganDosenController')
const md = require('../../middlewares/auth')


router.post('/ajukanBimbinganTA',md.authorizeRole('mahasiswa'),md.authenticateToken,bimbinganTA.ajukanJadwalBimbingan )
router.post('/getJadwalBimbinganTA',md.authorizeRole('mahasiswa'),md.authenticateToken,bimbinganTA.getAllJadwalBimbingan )

module.exports = router;