const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const process = require("process");

dotenv.config();

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

      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.json({ message: "Login successful", user, token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Auth;
