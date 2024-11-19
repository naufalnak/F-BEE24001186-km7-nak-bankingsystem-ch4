const bcrypt = require("bcrypt");

const UserService = require("../user");
const Email = require("../../config/nodemailer");
const prisma = require("../../config/prisma");
const { generateToken } = require("../../middlewares/auth");

jest.mock("../../config/prisma", () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("../../services/email");

jest.mock("../../middlewares/auth", () => ({
  generateToken: jest.fn(),
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user and return user and token", async () => {
      // Mock data
      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        identity_type: "KTP",
        identity_number: "1234567890",
      };

      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        profile: {
          identity_type: "KTP",
          identity_number: "1234567890",
        },
      };

      const mockToken = "fake-jwt-token";

      // Mock fungsi yang digunakan dalam createUser
      bcrypt.hash.mockResolvedValue("hashed-password");
      prisma.user.create.mockResolvedValue(mockUser);
      Email.sendEmail.mockResolvedValue(true);
      generateToken.mockReturnValue(mockToken);

      // Panggil method yang akan diuji
      const result = await UserService.createUser(mockData);

      // Verifikasi hasil
      expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: mockData.name,
          email: mockData.email,
          password: "hashed-password",
          profile: {
            create: {
              identity_type: mockData.identity_type,
              identity_number: mockData.identity_number,
            },
          },
        },
      });
      expect(Email.sendEmail).toHaveBeenCalledWith(
        mockData.email,
        "Welcome to our platform",
        expect.any(String)
      );
      expect(generateToken).toHaveBeenCalledWith({ id: mockUser.id });

      expect(result).toEqual({ user: mockUser, token: mockToken });
    });

    it("should throw an error if user creation fails", async () => {
      // Mock data
      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        identity_type: "KTP",
        identity_number: "1234567890",
      };

      // Mock prisma untuk melempar error
      prisma.user.create.mockRejectedValue(new Error("Database error"));

      // Panggil method dan periksa error
      await expect(UserService.createUser(mockData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getUsers", () => {
    it("should return a list of users with profiles", async () => {
      // Mock data
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          profile: {
            identity_type: "KTP",
            identity_number: "1234567890",
          },
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "jane@example.com",
          profile: {
            identity_type: "Passport",
            identity_number: "A12345678",
          },
        },
      ];

      // Mock Prisma
      prisma.user.findMany.mockResolvedValue(mockUsers);

      // Call the service
      const result = await UserService.getUsers();

      // Verify the results
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        include: { profile: true },
      });
      expect(result).toEqual(mockUsers);
    });

    it("should throw an error if Prisma throws an error", async () => {
      // Mock Prisma to throw an error
      prisma.user.findMany.mockRejectedValue(new Error("Database error"));

      // Call the service and expect an error
      await expect(UserService.getUsers()).rejects.toThrow("Database error");
    });
  });
});
