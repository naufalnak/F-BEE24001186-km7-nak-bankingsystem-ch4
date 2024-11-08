const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const Auth = require("../auth");
const errorHandler = require("../../middlewares/errorHandler");
const dotenv = require("dotenv");
const process = require("process");

dotenv.config();

jest.mock("jsonwebtoken");
jest.mock("../../config/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/login", Auth.login);
app.use(errorHandler);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully with valid credentials", async () => {
    const mockUser = {
      user_id: 1,
      email: "alice@example.com",
      password: "hashedpassword",
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    const mockToken = "mocked.jwt.token";
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post("/login")
      .send({ email: "alice@example.com", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Login successful",
      user: mockUser,
      token: mockToken,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "alice@example.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("password", mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("should return 401 for invalid email", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "invalid@example.com", password: "password" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid email or password" });
  });

  it("should return 401 for invalid password", async () => {
    const mockUser = {
      user_id: 1,
      email: "alice@example.com",
      password: "hashedpassword",
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: "alice@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid email or password" });
  });

  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Database error");
    prisma.user.findUnique.mockRejectedValue(mockError);

    const response = await request(app)
      .post("/login")
      .send({ email: "alice@example.com", password: "password" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
