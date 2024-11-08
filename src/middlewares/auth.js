const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const dotenv = require("dotenv");
const process = require("process");

dotenv.config();

class AuthMiddleware {
  static async authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token otorisasi diperlukan" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { user_id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ message: "Token tidak valid" });
      }

      req.user = user;
      next();
    } catch {
      return res
        .status(401)
        .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
  }
}

module.exports = AuthMiddleware;
