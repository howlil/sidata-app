import express from "express";
const router = express.Router();
import {
  buatAkunAdmin,
  login,
  logout,
  ubahPassword,
} from "../../controllers/auth/authController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import { buatAkunMahasiswa, buatAkunDosen,getDosenByBidang,getDosenPembimbingId,getAllDosenPembimbing,getDosenPembimbingByBidang ,getAllAkunDosen,getAllAkunMhs,akunDosenById,akunMhsById,editAkunDosen,editAkunMahasiswa} from '../../controllers/admin/kelolaAkunController.js';

router.post("/buatAkunAdmin", buatAkunAdmin);
router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.put("/ubahPassword", authenticateToken, ubahPassword);
router.get("/getDosenByBidang/:bidangId", authenticateToken, getDosenByBidang);
router.get("/getAllDosenPembimbing", authenticateToken, getAllDosenPembimbing);
router.get("/getDosenPembimbingByBidang/:bidangId", authenticateToken, getDosenPembimbingByBidang);
router.post("/getDosenPembimbingId", authenticateToken, getDosenPembimbingId);

router.post("/buatAkunMahasiswa", authenticateToken, authorizeRole("admin"), buatAkunMahasiswa);
router.post("/buatAkunDosen", authenticateToken, authorizeRole("admin"), buatAkunDosen);
router.get("/getAllAkunMhs", authenticateToken, authorizeRole("admin"), getAllAkunMhs);
router.get("/getAllAkunDosen", authenticateToken, getAllAkunDosen);
router.get("/getAkunDosenById/:id", authenticateToken, authorizeRole("admin"), akunDosenById);
router.get("/getAkunMhsById/:id", authenticateToken, authorizeRole("admin"), akunMhsById);
router.put("/editAkunDosen/:id", authenticateToken, authorizeRole("admin"), editAkunDosen);
router.put("/editAkunMhs/:id", authenticateToken, authorizeRole("admin"), editAkunMahasiswa);


export default router;