const express = require('express');
const router = express.Router();
const taController = require('../../controllers/mhs/tugasAkhirController');
const md = require('../../middlewares/auth')

router.post('/ajukanIdeTA',md.authenticateToken,md.authorizeRole('mahasiswa') ,taController.ajukanIdeTA);
router.put('/editAjukanIdeTA/:id', md.authorizeRole('mahasiswa') ,md.authenticateToken , taController.editAjukanIdeTA);
router.put('/ajukanJudulTA', md.authorizeRole('mahasiswa') ,md.authenticateToken, taController.ajukanJudulTA);
router.put('/editJudulTA/:id',md.authorizeRole('mahasiswa') ,md.authenticateToken , taController.editJudulTA);
router.post('/daftarTA',md.authorizeRole('mahasiswa') ,md.authenticateToken ,taController.uploadFiles ,taController.daftarTA);

module.exports = router;

