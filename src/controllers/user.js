const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

class UserController {
  static async createUser(req, res, next) {
    const { name, email, password, identity_type, identity_number } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
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
      res.status(201).json({ message: "User registered", user: user });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await prisma.user.findMany({
        include: { profile: true },
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: Number(userId) },
        include: { profile: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
