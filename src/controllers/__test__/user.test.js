const request = require("supertest");
const express = require("express");

const errorHandler = require("../../middlewares/errorHandler");
const UserController = require("../user");
const UserService = require("../../services/user");

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("../../middlewares/auth", () => ({
  generateToken: jest.fn(),
}));

jest.mock("../../services/user");

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
    it("should create a new user and return user and token", async () => {
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

      // Mock service response
      UserService.createUser.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app).post("/users").send(mockData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered");
      expect(response.body.user).toEqual(mockUser);
      expect(response.body.token).toBe(mockToken);
    });

    it("should return 500 if createUser fails", async () => {
      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        identity_type: "KTP",
        identity_number: "1234567890",
      };

      // Mock service untuk melempar error
      UserService.createUser.mockRejectedValue(new Error("Service error"));

      const response = await request(app).post("/users").send(mockData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Service error");
    });
  });

  describe("GET /users", () => {
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
      ];

      // Mock UserService response
      UserService.getUsers.mockResolvedValue(mockUsers);

      // Make the request
      const response = await request(app).get("/users");

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it("should call next with an error if UserService throws an error", async () => {
      // Mock UserService to throw an error
      UserService.getUsers.mockRejectedValue(new Error("Service error"));

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = {};
      const res = {
        json: jest.fn(),
      };

      await UserController.getUsers(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
