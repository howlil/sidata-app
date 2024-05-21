const express = require("express");
const router = express.Router();
const profile = require("../../controllers/auth/profileController");
const auth = require("../../middlewares/auth");

router.get("/infoAkun", auth.authenticateToken, profile.getUserById);
router.put(
  "/editProfil",
  auth.authenticateToken,
  profile.uploadFoto,
  profile.editUserProfile
);

module.exports = router;
