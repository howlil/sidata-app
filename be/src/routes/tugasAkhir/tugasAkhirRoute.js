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
import { accDaftarTA ,getAllDaftarTA,getDetailDaftarTAByMhsiswa} from "../../controllers/admin/AdminKelolaTaController.js";

router.post(
  "/ajukanIdeTA",
  authenticateToken,
  authorizeRole("mahasiswa"),
  ajukanIdeTA
);
router.put(
  "/editAjukanIdeTA/:id",
  authenticateToken,
  authorizeRole("mahasiswa"),
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
  authorizeRole("mahasiswa"),
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

router.put("/accIdeTA", 
  authorizeRole("dosen"),
  authenticateToken, 
  accIdeTA);

router.put(
  "/accJudulTA",
  authorizeRole("dosen"),
  authenticateToken,
  accJudulTA
);

router.put(
  "/accDaftarTA",
  authorizeRole("admin"),
  authenticateToken,
  accDaftarTA
);

router.get(
  "/getAllDaftarTA",
  authenticateToken,
  authorizeRole("admin"),
  getAllDaftarTA
);
router.get(
  "/getDetailDaftarTAByMhsiswa/:idMhsiswa",
  authenticateToken,
  authorizeRole("admin"),
  getDetailDaftarTAByMhsiswa
);

export default router;
