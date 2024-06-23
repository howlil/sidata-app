import express from "express";
const router = express.Router();
import {
  createBidang,
  deleteBidang,
  getAllBidang,
  getBidangById,
  updateBidang,
} from "../../controllers/dosen/BidangDosenController.js";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";

router.post("/createBidang", authenticateToken, authorizeRole("admin"), createBidang);
router.get("/getAllBidang", authenticateToken, getAllBidang);
router.get("/getBidangById/:id", authenticateToken, getBidangById);
router.put("/updateBidang/:id", authenticateToken, authorizeRole("admin"), updateBidang);
router.delete("/deleteBidang/:id", authenticateToken, authorizeRole("admin"), deleteBidang);

export default router;