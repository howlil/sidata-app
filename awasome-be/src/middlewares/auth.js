const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(404).json({
        success: false,
        message: "Masukkan token terlebih dahulu",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    console.log(token);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: err });
      }

      const isToken = await prisma.token.findFirst({
        where: { token },
      });
      console.log(isToken);
      if (!isToken)
        return res
          .status(401)
          .json({
            success: false,
            message: "Tidak ada token atau sudah logout sebelumnya",
          });

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Session Token Has Expired",
    });
  }
};

module.exports = authenticateToken;
