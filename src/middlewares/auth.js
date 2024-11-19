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

      // Cari user di database berdasarkan payload JWT
      const user = await prisma.user.findUnique({
        where: { user_id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ message: "Token tidak valid" });
      }

      req.user = user; // Simpan user ke request untuk digunakan di endpoint
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res
          .status(401)
          .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
      }
    }
  }

  static async generateToken(user) {
    const payload = {
      userId: user.user_id,
      role: user.role, // Tambahkan informasi lain yang diperlukan
    };

    // Hasilkan token dengan masa berlaku tertentu
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  }

  static async changePassword(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token otorisasi diperlukan" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { user_id: decoded.userId }; // Simpan payload token ke request
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

module.exports = AuthMiddleware;
