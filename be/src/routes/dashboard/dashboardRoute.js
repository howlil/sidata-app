import express from "express";
const router = express.Router();
import { authenticateToken } from "../../middlewares/auth.js";
import {
  getJumlahDosen,
  getJumlahMahasiswa,
  getJumlahTAterdaftar,
  getMahasiswaBimbingan,
  getJumlahBimbinganByDosen,
  getJumlahBimbinganByMahasiswa,
  getMahasiswaBimbinganByDosen,
} from "../../controllers/dashboard/dashboard.js";

router.get("/jumlahDosen", authenticateToken, getJumlahDosen);
router.get("/jumlahMahasiswa", authenticateToken, getJumlahMahasiswa);
router.get("/jumlahTAterdaftar", authenticateToken, getJumlahTAterdaftar);
router.get(
  "/jumlahBimbinganByDosen/:idDosen",
  authenticateToken,
  getJumlahBimbinganByDosen
);
router.get(
  "/jumlahBimbinganByMahasiswa/:idMahasiswa",
  authenticateToken,
  getJumlahBimbinganByMahasiswa
);
router.get(
  "/mahasiswaBimbingan/:dosenPembimbingID",
  authenticateToken,
  getMahasiswaBimbingan
);
router.get(
  "/mahasiswaBimbinganByDosen/:id",
  authenticateToken,
  getMahasiswaBimbinganByDosen
);

export default router;
