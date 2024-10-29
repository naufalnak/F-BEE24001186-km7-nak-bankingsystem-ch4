const request = require("supertest");
const express = require("express");
const TransactionController = require("../transaction");
const prisma = require("../../config/prisma");
const errorHandler = require("../../middlewares/errorHandler");

jest.mock("../../config/prisma", () => ({
  bankAccount: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

const app = express();

app.use(express.json());
app.post("/transactions", TransactionController.createTransaction);
app.get("/transactions", TransactionController.getTransactions);
app.get(
  "/transactions/:transactionId",
  TransactionController.getTransactionById
);
app.use(errorHandler);

describe("TransactionController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /transactions", () => {
    it("should create a new transaction", async () => {
      prisma.bankAccount.findUnique.mockImplementation((query) => {
        if (query.where.account_id === "1") {
          return Promise.resolve({ account_id: "1", balance: 1000 });
        }
        if (query.where.account_id === "2") {
          return Promise.resolve({ account_id: "2", balance: 500 });
        }
        return Promise.resolve(null);
      });

      prisma.transaction.create.mockResolvedValue({
        transaction_id: 1,
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      });

      prisma.bankAccount.update.mockImplementation((query) => {
        if (query.where.account_id === "1") {
          return Promise.resolve({ account_id: "1", balance: 700 });
        }
        if (query.where.account_id === "2") {
          return Promise.resolve({ account_id: "2", balance: 800 });
        }
      });

      const response = await request(app).post("/transactions").send({
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("transaction_id", 1);
    });

    it("should return 404 if source or destination account is not found", async () => {
      const transactionData = {
        source_account_id: 1,
        destination_account_id: 999,
        amount: 500,
      };

      prisma.bankAccount.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/transactions")
        .send(transactionData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "Source or Destination account not found"
      );
    });

    it("should return 400 for insufficient balance", async () => {
      prisma.bankAccount.findUnique.mockImplementation((query) => {
        if (query.where.account_id === "1") {
          return Promise.resolve({ account_id: "1", balance: 100 });
        }
        if (query.where.account_id === "2") {
          return Promise.resolve({ account_id: "2", balance: 500 });
        }
        return Promise.resolve(null);
      });

      const response = await request(app).post("/transactions").send({
        source_account_id: "1",
        destination_account_id: "2",
        amount: 200,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Insufficient balance in source account"
      );
    });

    it("should return error if prisma throws an error", async () => {
      const mockError = new Error("Database error");

      prisma.bankAccount.findUnique.mockRejectedValueOnce(mockError);

      const transactionData = {
        source_account_id: 1,
        destination_account_id: 2,
        amount: 500,
      };

      const response = await request(app)
        .post("/transactions")
        .send(transactionData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("GET /transactions", () => {
    it("should return all transactions", async () => {
      prisma.transaction.findMany.mockResolvedValueOnce([
        {
          transaction_id: 1,
          source_account_id: "1",
          destination_account_id: "2",
          amount: 300,
        },
      ]);
      const response = await request(app).get("/transactions");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("transaction_id", 1);
    });

    it("should return error if prisma throws an error", async () => {
      const mockError = new Error("Database error");

      prisma.transaction.findMany.mockRejectedValue(mockError);

      const response = await request(app).get("/transactions");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("GET /transactions/:transactionId", () => {
    it("should return a transaction by id", async () => {
      prisma.transaction.findUnique.mockResolvedValueOnce({
        transaction_id: 1,
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      });

      const response = await request(app).get("/transactions/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("transaction_id", 1);
    });

    it("should return 404 for non-existing transaction", async () => {
      prisma.transaction.findUnique.mockResolvedValueOnce(null);

      const response = await request(app).get("/transactions/9999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Transaction not found");
    });

    it("should return 500 if Prisma throws an error", async () => {
      const mockError = new Error("Database error");

      prisma.transaction.findUnique.mockRejectedValue(mockError);

      const response = await request(app).get("/transactions/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Database error",
      });
    });
  });
});
