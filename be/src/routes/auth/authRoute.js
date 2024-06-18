import express from "express";
const router = express.Router();
import {
  buatAkunAdmin,
  login,
  logout,
  ubahPassword,
} from "../../controllers/auth/authController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import { buatAkunMahasiswa, buatAkunDosen } from '../../controllers/admin/kelolaAkunController.js';

router.post("/buatAkunAdmin", buatAkunAdmin);
router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.put("/ubahPassword", authenticateToken, ubahPassword);
router.post("/buatAkunMahasiswa", authenticateToken, authorizeRole("admin"), buatAkunMahasiswa);
router.post("/buatAkunDosen", authenticateToken, authorizeRole("admin"), buatAkunDosen);

export default router;