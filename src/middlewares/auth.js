const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

class AuthMiddleware {
  static async authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token otorisasi diperlukan" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      const user = await prisma.user.findUnique({
        where: { user_id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ message: "Token tidak valid" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
  }
}

module.exports = AuthMiddleware;
