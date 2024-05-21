const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Masukkan token terlebih dahulu",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan dalam header",
      });

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token tidak valid atau telah kadaluwarsa",
        });
      }

      const isToken = await prisma.token.findFirst({
        where: { token },
      });

      if (!isToken) {
        return res.status(401).json({
          success: false,
          message: "Token tidak ditemukan atau sudah logout sebelumnya",
        });
      }

      req.user = decoded;
      req.tokenId = isToken.id;
      req.token = token;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki izin untuk mengakses resource ini" });
    }
    next();
  };
};


