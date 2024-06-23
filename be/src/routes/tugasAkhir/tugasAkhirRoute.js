import express from "express";
const router = express.Router();
import {
  ajukanIdeTA,
  ajukanJudulTA,
  editAjukanIdeTA,
  editJudulTA,
  upload,
  editDaftarTA,
  daftarTA
} from "../../controllers/mhs/tugasAkhirController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import {
  getAllTAMahasiswaByDosPemId,
  getTAdetailByIdMahasiswa,
  accIdeTA,
  accJudulTA,
} from "../../controllers/dosen/DosenKelolaTAController.js";
import { accDaftarTA ,getAllDaftarTA,getDetailDaftarTAByMhsiswa,getDetailDaftarTA} from "../../controllers/admin/AdminKelolaTaController.js";

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
  authenticateToken,
  authorizeRole("mahasiswa"),
  ajukanJudulTA
);
router.put(
  "/editJudulTA/:id",
  authenticateToken,
  authorizeRole("mahasiswa"),
  editJudulTA
);  
router.post(
  "/daftarTA",
  authenticateToken,
  authorizeRole("mahasiswa"),
  upload,
  daftarTA
);
router.put(
  "/editDaftarTA",
  authenticateToken,
  upload,
  editDaftarTA
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
  authenticateToken, 
  authorizeRole("dosen"),
  accIdeTA);

router.put(
  "/accJudulTA",
  authenticateToken,
  authorizeRole("dosen"),
  accJudulTA
);

router.put(
  "/accDaftarTA",
  authenticateToken,
  // authorizeRole("admin"),
  accDaftarTA
);

router.get(
  "/getAllDaftarTA",
  authenticateToken,
  getAllDaftarTA
);
router.get(
  "/getDetailDaftarTAByMhsiswa/:idMahasiswa",
  authenticateToken,
  getDetailDaftarTAByMhsiswa
);
router.get(
  "/getDetailDaftarTA/:id",
  authenticateToken,
  getDetailDaftarTA
);

export default router;
