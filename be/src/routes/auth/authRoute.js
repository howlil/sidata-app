const express = require("express");
const router = express.Router();
const {
  buatAkunAdmin,
  login,
  logout,
  ubahPassword,
} = require("../../controllers/auth/authController");
const {authenticateToken,authorizeRole} = require("../../middlewares/auth");
const {buatAkunMahasiswa,buatAkunDosen} = require('../../controllers/admin/kelolaAkunController')


router.post("/buatAkunAdmin", buatAkunAdmin);
router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.put("/ubahPassword", authenticateToken, ubahPassword);
router.post("/buatAkunMahasiswa",authenticateToken,authorizeRole("admin"),buatAkunMahasiswa)
router.post("/buatAkunDosen",authenticateToken,authorizeRole("admin"),buatAkunDosen)

module.exports = router;
