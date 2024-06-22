import express from "express";
const router = express.Router();
import {uploadFoto,editUserProfile,getUserById} from "../../controllers/auth/profileController.js";
import {authenticateToken} from "../../middlewares/auth.js";

router.get("/infoAkun", authenticateToken,getUserById);
router.put(
  "/editProfil",
  authenticateToken,
  uploadFoto,
  editUserProfile
);

export default router;