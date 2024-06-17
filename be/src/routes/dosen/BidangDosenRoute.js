const express = require("express");
const router = express.Router();
const {
  createBidang,
  deleteBidang,
  getAllBidang,
  getBidangById,
  updateBidang,
} = require("../../controllers/dosen/BidangDosenController");
const { authenticateToken, authorizeRole } = require("../../middlewares/auth");


router.post("/createBidang", authenticateToken, authorizeRole("admin"), createBidang);
router.get("/getAllBidang", authenticateToken, authorizeRole("admin"), getAllBidang);
router.get("/getBidangById/:id", authenticateToken, authorizeRole("admin"), getBidangById);
router.put("/updateBidang/:id", authenticateToken, authorizeRole("admin"), updateBidang);
router.delete("/deleteBidang/:id", authenticateToken, authorizeRole("admin"), deleteBidang);

module.exports = router;