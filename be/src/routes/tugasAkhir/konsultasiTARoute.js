import express from "express";
const router = express.Router();
import {
  ajukanJadwalKonsulProdi,
  getAllJadwalKonsulProdi,
  getRiwayatKonsulProdi,
  updateStatusJadwalKonsulProdi,
  getDetailPengajuanJadwalKonsultasi,
} from "../../controllers/mhs/konsultasiProdiController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";

router.post(
  "/ajukanKonsultasiKaprodi",
  authorizeRole("mahasiswa"),
  authenticateToken,
  ajukanJadwalKonsulProdi
);
router.get(
  "/getAllJadwalKonsultasi",
  authorizeRole("mahasiswa"),
  authenticateToken,
  getAllJadwalKonsulProdi
);
router.get(
  "/getRiwayatKonsultasi",
  authorizeRole("mahasiswa"),
  authenticateToken,
  getRiwayatKonsulProdi
);
router.put(
  "/updateStatusKonsultasi/:idJadwal",
  authorizeRole("admin"),
  authenticateToken,
  updateStatusJadwalKonsulProdi
);
router.get(
  "/getDetailPengajuanJadwalKonsultasi/:id",
  authenticateToken,
  getDetailPengajuanJadwalKonsultasi
);

export default router;
