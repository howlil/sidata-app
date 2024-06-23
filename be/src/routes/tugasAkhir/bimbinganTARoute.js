import express from "express";
const router = express.Router();
import {
  ajukanJadwalBimbingan,
  getJadwalBimbinganById,
  getJadwalBimbinganByMahasiswa,
  getJadwalBimbinganByMahasiswaAndDosen,
  getJadwalBimbinganByDosen,
  getAllJadwalBimbingan,
  getRiwayatBimbingan,
  ubahStatusAjuanBimbingan,
} from "../../controllers/mhs/bimbinganDosenController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";

router.post(
  "/ajukanBimbinganTA",
  authenticateToken,
  ajukanJadwalBimbingan
);
router.post(
  "/getJadwalBimbinganTA",
  authenticateToken,
  getAllJadwalBimbingan
);
router.get("/getRiwayatBimbinganTA", authenticateToken, getRiwayatBimbingan);

router.put(
  "/updateStatusBimbinganTA/:idJadwal",
  authenticateToken,
  ubahStatusAjuanBimbingan
);

router.get(
  "/getJadwalBimbinganByMahasiswa/:idMahasiswa",
  authenticateToken,
  getJadwalBimbinganByMahasiswa
);
router.get(
  "/getJadwalBimbinganByDosen/:idDosen",
  authenticateToken,
  getJadwalBimbinganByDosen
);
router.get(
  "/getJadwalBimbinganByMahasiswaAndDosen/:idMahasiswa/:idDosen",
  authenticateToken,
  getJadwalBimbinganByMahasiswaAndDosen
);

router.get(
  "/getJadwalBimbinganById/:id",
  authenticateToken,
  getJadwalBimbinganById
);

export default router;
