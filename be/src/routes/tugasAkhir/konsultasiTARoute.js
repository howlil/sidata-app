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
  authenticateToken,
  authorizeRole("mahasiswa"),
  ajukanJadwalKonsulProdi
);
router.get(
  "/getAllJadwalKonsultasi",
  authenticateToken,
  getAllJadwalKonsulProdi
);
router.get(
  "/getRiwayatKonsultasi/:id",
  authenticateToken,
  authorizeRole("mahasiswa"),
  getRiwayatKonsulProdi
);
router.put(
  "/updateStatusKonsultasi/:id",
  authenticateToken,
  authorizeRole("admin"),
  updateStatusJadwalKonsulProdi
);
router.get(
  "/getDetailPengajuanJadwalKonsultasi/:id",
  authenticateToken,
  getDetailPengajuanJadwalKonsultasi
);

export default router;
