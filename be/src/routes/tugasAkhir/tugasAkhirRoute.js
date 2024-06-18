import express from "express";
const router = express.Router();
import {
  ajukanIdeTA,
  ajukanJudulTA,
  editAjukanIdeTA,
  editJudulTA,
  daftarTA,
  uploadFiles
} from "../../controllers/mhs/tugasAkhirController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";

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

export default router;