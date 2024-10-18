const prisma = require("../config/prisma");

class UserController {
  static async createUser(req, res) {
    const { name, email, password, identity_type, identity_number } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          profile: {
            create: {
              identity_type,
              identity_number,
            },
          },
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        include: { profile: true },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: Number(userId) },
        include: { profile: true },
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    try {
      const user = await prisma.user.update({
        where: { user_id: Number(userId) },
        data: { name, email, password },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      await prisma.user.delete({
        where: { user_id: Number(userId) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
