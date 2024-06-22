import express from "express";
const router = express.Router();
import {
  ajukanIdeTA,
  ajukanJudulTA,
  editAjukanIdeTA,
  editJudulTA,
  upload,
  daftarTA
} from "../../controllers/mhs/tugasAkhirController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import {
  getAllTAMahasiswaByDosPemId,
  getTAdetailByIdMahasiswa,
  accIdeTA,
  accJudulTA,
} from "../../controllers/dosen/DosenKelolaTAController.js";
import { accDaftarTA } from "../../controllers/admin/AdminKelolaTaController.js";

router.post(
  "/ajukanIdeTA",
  authenticateToken,
  authorizeRole("mahasiswa"),
  ajukanIdeTA
);
router.put(
  "/editAjukanIdeTA/:id",
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
  authenticateToken,
  upload,
  daftarTA
);

router.get(
  "/getAllTAMahasiswaByDosPemId/:id",
  authenticateToken,
  getAllTAMahasiswaByDosPemId
);

router.get(
  "/getTAdetailByIdMahasiswa/:id",
  authenticateToken,
  getTAdetailByIdMahasiswa
);

router.put("/accIdeTA", authenticateToken, accIdeTA);

router.put(
  "/accJudulTA",
  authenticateToken,
  accJudulTA
);

router.put(
  "/accDaftarTA",
  authenticateToken,
  accDaftarTA
);

export default router;
