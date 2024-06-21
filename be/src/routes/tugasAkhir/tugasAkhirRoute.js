import express from "express";
const router = express.Router();
import {
  ajukanIdeTA,
  ajukanJudulTA,
  editAjukanIdeTA,
  editJudulTA,
  uploadBuktiKP,
  uploadBuktiKRS,
  uploadBuktiLulus,
  uploadSuratIzinKuliah,
  uploadSuratTugas,
  uploadTranskripNilai,
  daftarTAMahasiswa
} from "../../controllers/mhs/tugasAkhirController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import {
  getAllTAMahasiswaByDosPemId,
  getTAdetailByIdMahasiswa,
  accIdeTA,
  accJudulTA,
} from "../../controllers/dosen/DosenKelolaTAController.js";

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
  "/daftarTAMahasiswa",
  daftarTAMahasiswa
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

export default router;
