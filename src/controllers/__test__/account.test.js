const request = require("supertest");
const express = require("express");
const AccountController = require("../account");
const AuthMiddleware = require("../../middlewares/auth");
const prisma = require("../../config/prisma");
const errorHandler = require("../../middlewares/errorHandler");

jest.mock("../../config/prisma", () => ({
  bankAccount: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const app = express();

app.use(express.json());

app.post("/accounts", AccountController.createAccount);
app.get("/accounts", AccountController.getAccounts);
app.get("/accounts/:accountId", AccountController.getAccountById);
app.post("/accounts/:accountId/deposit", AccountController.deposit);
app.post("/accounts/:accountId/withdraw", AccountController.withdraw);
app.use(errorHandler);

describe("AccountControler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Done
  describe("POST /accounts", () => {
    it("should create a new account", async () => {
      const newAccount = {
        bank_name: "Test Bank",
        bank_account_number: "123456789",
        balance: 500,
        user_id: 1,
      };

      prisma.bankAccount.create.mockResolvedValue(newAccount);

      const response = await request(app).post("/accounts").send(newAccount);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newAccount);
      expect(prisma.bankAccount.create).toHaveBeenCalledWith({
        data: {
          bank_name: "Test Bank",
          bank_account_number: "123456789",
          balance: 500,
          user_id: 1,
        },
      });
    });

    it("should return error if prisma throws an error", async () => {
      const mockError = new Error("Database error");

      prisma.bankAccount.create.mockRejectedValue(mockError);

      const response = await request(app).post("/accounts").send({
        user_id: 1,
        bank_name: "Bank A",
        bank_account_number: "1234567890",
        balance: 1000,
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  // Done
  describe("GET /accounts", () => {
    it("should return all accounts", async () => {
      const accounts = [
        {
          account_id: 1,
          bank_name: "Test Bank",
          bank_account_number: "123456789",
          balance: 500,
        },
      ];

      prisma.bankAccount.findMany.mockResolvedValue(accounts);

      const response = await request(app).get("/accounts");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(accounts);
    });

    it("should handle errors and call next()", async () => {
      const mockError = new Error("Database error");

      prisma.bankAccount.findMany.mockRejectedValue(mockError);

      const response = await request(app).get("/accounts");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  //
  describe("GET /accounts/:accountId", () => {
    it("should return account by id", async () => {
      const account = {
        account_id: 1,
        bank_name: "Test Bank",
        bank_account_number: "123456789",
        balance: 500,
      };
      prisma.bankAccount.findUnique.mockResolvedValue(account);
      const response = await request(app).get("/accounts/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(account);
    });

    it("should return 404 if account not found", async () => {
      prisma.bankAccount.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/accounts/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Account not found");
    });

    it("should return 500 if Prisma throws an error", async () => {
      prisma.bankAccount.findUnique.mockRejectedValue(
        new Error("Database error")
      );
      const response = await request(app).get("/accounts/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  // Done
  describe("POST /accounts/:accountId/deposit", () => {
    it("should deposit money into account", async () => {
      const account = {
        account_id: 1,
        bank_name: "Test Bank",
        bank_account_number: "123456789",
        balance: 500,
      };
      const updatedAccount = { ...account, balance: 700 };
      prisma.bankAccount.findUnique.mockResolvedValue(account);
      prisma.bankAccount.update.mockResolvedValue(updatedAccount);

      const response = await request(app)
        .post("/accounts/1/deposit")
        .send({ amount: 200 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedAccount);
    });

    it("should return error if deposit amount is negative", async () => {
      const response = await request(app)
        .post("/accounts/1/deposit")
        .send({ amount: -200 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Deposit amount must be positive",
      });
    });

    it("should return error if account not found", async () => {
      prisma.bankAccount.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/accounts/1/deposit")
        .send({ amount: 200 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Account not found",
      });
    });

    it("should return error if prisma throws an error", async () => {
      prisma.bankAccount.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/accounts/1/deposit")
        .send({ amount: 200 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Database error",
      });
    });
  });

  describe("POST /accounts/:accountId/withdraw", () => {
    it("should withdraw money from account", async () => {
      const account = {
        account_id: 1,
        bank_name: "Test Bank",
        bank_account_number: "123456789",
        balance: 500,
      };
      const updatedAccount = { ...account, balance: 300 };
      prisma.bankAccount.findUnique.mockResolvedValue(account);
      prisma.bankAccount.update.mockResolvedValue(updatedAccount);

      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: 200 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedAccount);
    });

    it("should return error if withdrawal amount is negative", async () => {
      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: -200 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Withdrawal amount must be positive",
      });
    });

    it("should return error if account not found", async () => {
      prisma.bankAccount.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: 200 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Account not found",
      });
    });

    it("should return error if insufficient funds", async () => {
      const account = {
        account_id: 1,
        bank_name: "Test Bank",
        bank_account_number: "123456789",
        balance: 500,
      };

      prisma.bankAccount.findUnique.mockResolvedValue(account);

      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: 600 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Insufficient balance for withdrawal",
      });
    });

    it("should return error if prisma throws an error", async () => {
      prisma.bankAccount.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: 200 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Database error",
      });
    });
  });
});
