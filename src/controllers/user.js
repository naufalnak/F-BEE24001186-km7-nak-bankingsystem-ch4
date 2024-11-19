const UserService = require("../services/user");

class UserController {
  static async createUser(req, res, next) {
    try {
      const { user, token } = await UserService.createUser(req.body);

      if (res.locals.io) {
        res.locals.io.emit("registration_success", {
          message: "User registered successfully",
          user: { user, token },
        });
      } else {
        console.error("Socket.IO instance not found!");
      }

      // Response dengan user dan token
      res.status(201).json({
        message: "User registered",
        user: user,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async uploadImage(req, res, next) {
    const { userId } = req.params;
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res
        .status(400)
        .json({ message: "No image provided or upload failed" });
    }

    try {
      const user = await UserService.uploadImage(userId, image);

      res.json({
        message: "User image updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
