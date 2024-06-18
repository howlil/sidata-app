import express from "express";
const router = express.Router();
import {
  buatAkunAdmin,
  login,
  logout,
  ubahPassword,
} from "../../controllers/auth/authController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import { buatAkunMahasiswa, buatAkunDosen ,getAllAkunDosen,getAllAkunMhs,akunDosenById,akunMhsById} from '../../controllers/admin/kelolaAkunController.js';

router.post("/buatAkunAdmin", buatAkunAdmin);
router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.put("/ubahPassword", authenticateToken, ubahPassword);
router.post("/buatAkunMahasiswa", authenticateToken, authorizeRole("admin"), buatAkunMahasiswa);
router.post("/buatAkunDosen", authenticateToken, authorizeRole("admin"), buatAkunDosen);
router.get("/getAllAkunMhs", authenticateToken, authorizeRole("admin"), getAllAkunMhs);
router.get("/getAllAkunDosen", authenticateToken, authorizeRole("admin"), getAllAkunDosen);
router.get("/getAkunDosenById/:id", authenticateToken, authorizeRole("admin"), akunDosenById);
router.get("/getAkunMhsById/:id", authenticateToken, authorizeRole("admin"), akunMhsById);

export default router;