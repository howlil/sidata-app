import express from "express";
const router = express.Router();
import {
  createJabatan,
  deleteJabatan,
  getAllJabatan,
  getJabatanById,
  updateJabatan,
} from "../../controllers/dosen/JabatanDosenController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";

router.post("/createJabatan", authenticateToken, authorizeRole("admin"), createJabatan);
router.get("/getAllJabatan", authenticateToken, getAllJabatan);
router.get("/getJabatanById/:id", authenticateToken, getJabatanById);
router.put("/updateJabatan/:id", authenticateToken, authorizeRole("admin"), updateJabatan);
router.delete("/deleteJabatan/:id", authenticateToken, authorizeRole("admin"), deleteJabatan);

export default router;