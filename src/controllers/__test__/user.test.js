const { describe, it, expect, beforeEach, jest } = require("@jest/globals");
const request = require("supertest");
const express = require("express");
const UserController = require("../user");
const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const errorHandler = require("../../middlewares/errorHandler");

jest.mock("../../config/prisma", () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const app = express();

app.use(express.json());
app.post("/users", UserController.createUser);
app.get("/users", UserController.getUsers);
app.get("/users/:userId", UserController.getUserById);
app.use(errorHandler);

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users", () => {
    it("should create a new user and return 201", async () => {
      const mockUser = {
        user_id: 1,
        name: "Alice",
        email: "alice@example.com",
        password: "hashedPassword",
        profile: {
          identity_type: "ID Card",
          identity_number: "1234567890",
        },
      };

      const hashedPassword = "hashedPassword";
      bcrypt.hash.mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue(mockUser);

      const response = await request(app).post("/users").send({
        name: "Alice",
        email: "alice@example.com",
        password: "plainPassword",
        identity_type: "ID Card",
        identity_number: "1234567890",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered",
        user: mockUser,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("plainPassword", 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Alice",
          email: "alice@example.com",
          password: hashedPassword,
          profile: {
            create: {
              identity_type: "ID Card",
              identity_number: "1234567890",
            },
          },
        },
      });
    });

    it("should handle errors and call next with error", async () => {
      const mockError = new Error("Database error");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      prisma.user.create.mockRejectedValue(mockError);

      const response = await request(app).post("/users").send({
        name: "Alice",
        email: "alice@example.com",
        password: "plainPassword",
        identity_type: "ID Card",
        identity_number: "1234567890",
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("GET /users", () => {
    it("should get all users successfully", async () => {
      prisma.user.findMany.mockResolvedValue([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          profile: {
            identity_type: "KTP",
            identity_number: "123456789",
          },
        },
      ]);

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });

    it("should return 500 if Prisma throws an error", async () => {
      const mockError = new Error("Database error");

      prisma.user.findMany.mockRejectedValue(mockError);

      const response = await request(app).get("/users");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("GET /users/:userId", () => {
    it("should get user by ID successfully", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        profile: {
          identity_type: "KTP",
          identity_number: "123456789",
        },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app).get("/users/1");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("John Doe");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: { profile: true },
      });
    });

    it("should return 404 if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/users/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User not found" });
    });

    it("should return 500 if Prisma throws an error", async () => {
      const mockError = new Error("Database error");

      prisma.user.findUnique.mockRejectedValue(mockError);

      const response = await request(app).get("/users/999");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });
});
