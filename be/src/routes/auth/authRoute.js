const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");
const auth = require("../../middlewares/auth");

router.post("/buatAkun", authController.buatAkun);
router.post("/buatAkunUser",auth.authenticateToken,auth.authorizeRole(['ADMIN']), authController.buatAkunUser);
router.post("/login", authController.login);
router.delete("/logout", auth.authenticateToken, authController.logout);
router.put("/ubahPassword", auth.authenticateToken,    authController.ubahPassword);

module.exports = router;
