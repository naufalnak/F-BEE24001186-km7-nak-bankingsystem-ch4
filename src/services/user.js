const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const process = require("process");
const path = require("path");

dotenv.config();

const AuthMiddleware = require("../middlewares/auth");
const Email = require("../config/nodemailer");

class User {
  static async createUser(data) {
    const { name, email, password, identity_type, identity_number } = data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user di database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            identity_type,
            identity_number,
          },
        },
      },
    });

    const templatePath = path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      "../templates/registration.html"
    );

    await Email.sendEmail(email, "Welcome to our platform", templatePath);

    // Generate token untuk autentikasi
    const token = AuthMiddleware.generateToken({ id: user.id });

    return { user, token };
  }

  static async getUsers() {
    return await prisma.user.findMany({
      include: { profile: true },
    });
  }

  static async getUserById(userId) {
    return await prisma.user.findUnique({
      where: { user_id: Number(userId) },
      include: { profile: true },
    });
  }

  static async uploadImage(userId, imagePath) {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: parseInt(userId) },
        include: { profile: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const updatedProfile = await prisma.profile.update({
        where: { user_id: parseInt(userId) },
        data: {
          image_profile: imagePath,
        },
      });

      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update user image: ${error.message}`);
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      if (!userId) {
        throw new Error("Invalid token payload");
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password di database
      await prisma.user.update({
        where: { user_id: userId },
        data: { password: hashedPassword },
      });

      return { message: "Password updated successfully" };
    } catch (error) {
      console.error("Error in resetPassword service:", error);
      throw new Error("Invalid or expired token");
    }
  }

  static async changePassword(userId, oldPassword, newPassword) {
    try {
      // Temukan user berdasarkan ID
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Validasi password lama
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      console.log("Password valid:", isValidPassword); // Debug log
      if (!isValidPassword) {
        throw new Error("Old password is incorrect");
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password di database
      await prisma.user.update({
        where: { user_id: userId },
        data: { password: hashedPassword },
      });

      return { message: "Password successfully updated" };
    } catch (error) {
      console.error("Error in changePassword:", error);
      throw error;
    }
  }
}

module.exports = User;
