const express = require('express');
const router = express.Router();
const {ajukanJadwalBimbingan,getAllJadwalBimbingan} = require('../../controllers/mhs/bimbinganDosenController')
const {authenticateToken,authorizeRole} = require('../../middlewares/auth')


router.post('/ajukanBimbinganTA',authorizeRole('mahasiswa'),authenticateToken,ajukanJadwalBimbingan )
router.post('/getJadwalBimbinganTA',authorizeRole('mahasiswa'),authenticateToken,getAllJadwalBimbingan )

module.exports = router;