const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const process = require("process");
const path = require("path");

const emailService = require("../config/nodemailer");
const userService = require("../services/user");

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

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN, // Token berlaku 1 jam
        }
      );
      const resetLink = `${process.env.FRONTEND_URL}/api/v1/reset-password?token=${resetToken}`;

      const templatePath = path.resolve(
        // eslint-disable-next-line no-undef
        __dirname,
        "../templates/resetPasswordTemplate.html"
      );

      await emailService.sendEmail(email, "Reset Your Password", templatePath, {
        RESET_LINK: resetLink,
      });

      res.status(200).json({ message: "Reset password email sent" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (res.locals.io) {
        res.locals.io.emit("password_reset", {
          message: "Reset Password Success",
          user: { token, newPassword },
        });
      } else {
        console.error("Socket.IO instance not found!");
      }

      if (!token || !newPassword) {
        return res
          .status(400)
          .json({ message: "Token and newPassword are required" });
      }

      // Panggil service reset password
      const result = await userService.resetPassword(token, newPassword);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in resetPassword controller:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      console.log("User ID from req.user:", req.user.user_id); // Tambahkan log ini

      const { oldPassword, newPassword } = req.body;
      const userId = req.user.user_id;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Old and new passwords are required" });
      }

      const result = await userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in changePassword controller:", error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = Auth;
