const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

class User {
  static async createUser(data) {
    const { name, email, password, identity_type, identity_number } = data;
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
    return user;
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
}

module.exports = User;
