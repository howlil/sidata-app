const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");
const auth = require("../../middlewares/auth");

router.delete("/logout", auth, authController.logout);
router.put("/ubahPassword", auth, authController.ubahPassword);

module.exports = router;
