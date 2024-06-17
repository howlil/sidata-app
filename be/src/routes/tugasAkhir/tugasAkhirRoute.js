const express = require("express");
const router = express.Router();
const {
  ajukanIdeTA,
  ajukanJudulTA,
  editAjukanIdeTA,
  editJudulTA,
  daftarTA,
  uploadFiles
} = require("../../controllers/mhs/tugasAkhirController");
const { authenticateToken, authorizeRole } = require("../../middlewares/auth");

router.post(
  "/ajukanIdeTA",
  authenticateToken,
  authorizeRole("mahasiswa"),
  ajukanIdeTA
);
router.put(
  "/editAjukanIdeTA/:id",
  authorizeRole("mahasiswa"),
  authenticateToken,
  editAjukanIdeTA
);
router.put(
  "/ajukanJudulTA",
  authorizeRole("mahasiswa"),
  authenticateToken,
  ajukanJudulTA
);
router.put(
  "/editJudulTA/:id",
  authorizeRole("mahasiswa"),
  authenticateToken,
  editJudulTA
);
router.post(
  "/daftarTA",
  authorizeRole("mahasiswa"),
  authenticateToken,
  uploadFiles,
  daftarTA
);


module.exports = router;
