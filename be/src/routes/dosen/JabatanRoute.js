const express = require("express");
const router = express.Router();
const {
  createJabatan,
  deleteJabatan,
  getAllJabatan,
  getJabatanById,
  updateJabatan,
} = require("../../controllers/dosen/JabatanDosenController");
const { authenticateToken, authorizeRole } = require("../../middlewares/auth");

router.post("/createJabatan", authenticateToken, authorizeRole("admin"), createJabatan);
router.get("/getAllJabatan", authenticateToken, authorizeRole("admin"), getAllJabatan);
router.get("/getJabatanById/:id", authenticateToken, authorizeRole("admin"), getJabatanById);
router.put("/updateJabatan/:id", authenticateToken, authorizeRole("admin"), updateJabatan);
router.delete("/deleteJabatan/:id", authenticateToken, authorizeRole("admin"), deleteJabatan);

module.exports = router;