import express from "express";
const router = express.Router();
import {
  ajukanJadwalBimbingan,
  getDetailPengajuanJadwalBimbingan,
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
  authorizeRole("mahasiswa"),
  authenticateToken,
  ajukanJadwalBimbingan
);
router.post(
  "/getJadwalBimbinganTA",
  authorizeRole("mahasiswa"),
  authenticateToken,
  getAllJadwalBimbingan
);
router.get("/getRiwayatBimbinganTA", authenticateToken, getRiwayatBimbingan);
router.put(
  "/updateStatusBimbinganTA/:idJadwal",
  authorizeRole("admin"),
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
  "/getDetailPengajuanJadwalBimbingan/:id",
  authenticateToken,
  getDetailPengajuanJadwalBimbingan
);
router.get(
  "/getJadwalBimbinganById/:idJadwal",
  authenticateToken,
  getJadwalBimbinganById
);

export default router;
