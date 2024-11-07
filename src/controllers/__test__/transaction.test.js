const request = require("supertest");
const { describe, it, expect, beforeEach, jest } = require("@jest/globals");
const express = require("express");
const TransactionController = require("../../controllers/transaction");
const TransactionService = require("../../services/transaction");
const errorHandler = require("../../middlewares/errorHandler");

jest.mock("../../services/transaction"); // Mocking TransactionService

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
      const mockTransaction = {
        transaction_id: 1,
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      };
      TransactionService.createTransaction.mockResolvedValue(mockTransaction);

      const response = await request(app).post("/transactions").send({
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTransaction);
      expect(TransactionService.createTransaction).toHaveBeenCalledWith({
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      });
    });

    it("should return error if TransactionService throws an error", async () => {
      const mockError = new Error("Source or Destination account not found");
      TransactionService.createTransaction.mockRejectedValue(mockError);

      const response = await request(app).post("/transactions").send({
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Source or Destination account not found"
      );
    });
  });

  describe("GET /transactions", () => {
    it("should return all transactions", async () => {
      const mockTransactions = [
        {
          transaction_id: 1,
          source_account_id: "1",
          destination_account_id: "2",
          amount: 300,
        },
      ];
      TransactionService.getTransactions.mockResolvedValue(mockTransactions);

      const response = await request(app).get("/transactions");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransactions);
    });

    it("should return error if TransactionService throws an error", async () => {
      const mockError = new Error("Database error");
      TransactionService.getTransactions.mockRejectedValue(mockError);

      const response = await request(app).get("/transactions");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("GET /transactions/:transactionId", () => {
    it("should return a transaction by id", async () => {
      const mockTransaction = {
        transaction_id: 1,
        source_account_id: "1",
        destination_account_id: "2",
        amount: 300,
      };
      TransactionService.getTransactionById.mockResolvedValue(mockTransaction);

      const response = await request(app).get("/transactions/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransaction);
    });

    it("should return 404 for non-existing transaction", async () => {
      TransactionService.getTransactionById.mockResolvedValue(null);

      const response = await request(app).get("/transactions/9999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Transaction not found");
    });

    it("should return 500 if TransactionService throws an error", async () => {
      const mockError = new Error("Database error");
      TransactionService.getTransactionById.mockRejectedValue(mockError);

      const response = await request(app).get("/transactions/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Database error");
    });
  });
});
