const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Auth {
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        return res.status(401).json({ error: "Invalid email or password" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(401).json({ error: "Invalid email or password" });

      const token = jwt.sign({ userId: user.user_id }, "your_jwt_secret", {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful", user, token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Auth;
