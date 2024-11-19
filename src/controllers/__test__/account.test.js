const request = require("supertest");
const express = require("express");
const accountController = require("../../controllers/account");
const accountService = require("../../services/account");

jest.mock("../../services/account"); // Mock accountService

const app = express();
app.use(express.json());

app.post("/accounts", accountController.createAccount);
app.get("/accounts", accountController.getAccounts);
app.get("/accounts/:accountId", accountController.getAccountById);
app.post("/accounts/:accountId/deposit", accountController.deposit);
app.post("/accounts/:accountId/withdraw", accountController.withdraw);

describe("AccountControler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Done
  describe("POST /accounts", () => {
    it("should create a new bank account and return it", async () => {
      // Mock data
      const mockRequestData = {
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 1000,
      };
      const mockResponseData = { id: 1, ...mockRequestData };

      // Mock accountService response
      accountService.createAccount.mockResolvedValue(mockResponseData);

      // Make the request
      const response = await request(app)
        .post("/accounts")
        .send(mockRequestData);

      // Verify the response
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponseData);
      expect(accountService.createAccount).toHaveBeenCalledWith(
        mockRequestData
      );
    });

    it("should call next with an error if accountService throws an error", async () => {
      // Mock accountService to throw an error
      accountService.createAccount.mockRejectedValue(
        new Error("Service error")
      );

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await accountController.createAccount(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Done
  describe("GET /accounts", () => {
    it("should return a list of all bank accounts", async () => {
      // Mock data
      const mockAccounts = [
        {
          id: 1,
          user_id: 1,
          bank_name: "Bank ABC",
          bank_account_number: "1234567890",
          balance: 1000,
        },
        {
          id: 2,
          user_id: 2,
          bank_name: "Bank XYZ",
          bank_account_number: "9876543210",
          balance: 2000,
        },
      ];

      // Mock accountService response
      accountService.getAllAccounts.mockResolvedValue(mockAccounts);

      // Make the request
      const response = await request(app).get("/accounts");

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccounts);
      expect(accountService.getAllAccounts).toHaveBeenCalled();
    });

    it("should call next with an error if accountService throws an error", async () => {
      // Mock accountService to throw an error
      accountService.getAllAccounts.mockRejectedValue(
        new Error("Service error")
      );

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await accountController.getAccounts(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Done
  describe("GET /accounts/:accountId", () => {
    it("should return the account when it exists", async () => {
      // Mock data
      const accountId = 1;
      const mockAccount = {
        account_id: accountId,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 1000,
      };

      // Mock accountService response
      accountService.getAccountById.mockResolvedValue(mockAccount);

      // Make the request
      const response = await request(app).get(`/accounts/${accountId}`);

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccount);
      expect(accountService.getAccountById).toHaveBeenCalledWith(
        accountId.toString()
      );
    });

    it("should return 404 if the account does not exist", async () => {
      // Mock accountService to return null
      accountService.getAccountById.mockResolvedValue(null);

      // Make the request
      const response = await request(app).get("/accounts/999"); // ID yang tidak ada

      // Verify the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Account not found" });
    });

    it("should call next with an error if accountService throws an error", async () => {
      // Mock accountService to throw an error
      accountService.getAccountById.mockRejectedValue(
        new Error("Service error")
      );

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = { params: { accountId: "1" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await accountController.getAccountById(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Done
  describe("GET /accounts/:accountId", () => {
    it("should return the account when it exists", async () => {
      // Mock data
      const accountId = 1;
      const mockAccount = {
        account_id: accountId,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 1000,
      };

      // Mock accountService response
      accountService.getAccountById.mockResolvedValue(mockAccount);

      // Make the request
      const response = await request(app).get(`/accounts/${accountId}`);

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccount);
      expect(accountService.getAccountById).toHaveBeenCalledWith(
        accountId.toString()
      );
    });

    it("should return 404 if the account does not exist", async () => {
      // Mock accountService to return null
      accountService.getAccountById.mockResolvedValue(null);

      // Make the request
      const response = await request(app).get("/accounts/999"); // ID yang tidak ada

      // Verify the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Account not found" });
    });

    it("should call next with an error if accountService throws an error", async () => {
      // Mock accountService to throw an error
      accountService.getAccountById.mockRejectedValue(
        new Error("Service error")
      );

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = { params: { accountId: "1" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await accountController.getAccountById(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Done
  describe("POST /accounts/:accountId/deposit", () => {
    it("should deposit amount to the account and return the updated account", async () => {
      // Mock data
      const accountId = 1;
      const amount = 100;
      const mockAccount = {
        account_id: accountId,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 1100,
      };

      // Mock accountService response
      accountService.getAccountById.mockResolvedValue(mockAccount);
      accountService.deposit.mockResolvedValue(mockAccount);

      // Make the request
      const response = await request(app)
        .post(`/accounts/${accountId}/deposit`)
        .send({ amount });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccount);
      expect(accountService.getAccountById).toHaveBeenCalledWith(
        accountId.toString()
      );
      expect(accountService.deposit).toHaveBeenCalledWith(
        accountId.toString(),
        amount
      );
    });

    it("should return 400 if deposit amount is not positive", async () => {
      // Make the request
      const response = await request(app)
        .post("/accounts/1/deposit")
        .send({ amount: -100 });

      // Verify the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Deposit amount must be positive",
      });
    });

    it("should return 404 if account is not found", async () => {
      // Mock accountService to return null
      accountService.getAccountById.mockResolvedValue(null);

      // Make the request
      const response = await request(app)
        .post("/accounts/999/deposit")
        .send({ amount: 100 });

      // Verify the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Account not found" });
      expect(accountService.getAccountById).toHaveBeenCalledWith("999");
    });

    it("should call next with an error if accountService throws an error", async () => {
      // Mock accountService to throw an error
      accountService.getAccountById.mockRejectedValue(
        new Error("Service error")
      );

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = { params: { accountId: "1" }, body: { amount: 100 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await accountController.deposit(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Done
  describe("POST /accounts/:accountId/withdraw", () => {
    it("should withdraw amount from the account and return the updated account", async () => {
      // Mock data
      const accountId = 1;
      const amount = 100;
      const mockAccount = {
        account_id: accountId,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 900,
      };

      // Mock accountService response
      accountService.getAccountById.mockResolvedValue(mockAccount);
      accountService.withdraw.mockResolvedValue(mockAccount);

      // Make the request
      const response = await request(app)
        .post(`/accounts/${accountId}/withdraw`)
        .send({ amount });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccount);
      expect(accountService.getAccountById).toHaveBeenCalledWith(
        accountId.toString()
      );
      expect(accountService.withdraw).toHaveBeenCalledWith(
        accountId.toString(),
        amount
      );
    });

    it("should return 400 if withdrawal amount is not positive", async () => {
      // Make the request
      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: -100 });

      // Verify the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Withdrawal amount must be positive",
      });
    });

    it("should return 404 if account is not found", async () => {
      // Mock accountService to return null
      accountService.getAccountById.mockResolvedValue(null);

      // Make the request
      const response = await request(app)
        .post("/accounts/999/withdraw")
        .send({ amount: 100 });

      // Verify the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Account not found" });
      expect(accountService.getAccountById).toHaveBeenCalledWith("999");
    });

    it("should return 400 if insufficient balance for withdrawal", async () => {
      // Mock accountService to return an account with insufficient balance
      const mockAccount = {
        account_id: 1,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 50, // Saldo tidak cukup untuk penarikan
      };
      accountService.getAccountById.mockResolvedValue(mockAccount);

      // Make the request
      const response = await request(app)
        .post("/accounts/1/withdraw")
        .send({ amount: 100 });

      // Verify the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Insufficient balance for withdrawal",
      });
    });

    it("should call next with an error if accountService throws an error", async () => {
      // Mock accountService to throw an error
      accountService.getAccountById.mockRejectedValue(
        new Error("Service error")
      );

      // Mock next function
      const next = jest.fn();

      // Call the controller directly with mock req, res, next
      const req = { params: { accountId: "1" }, body: { amount: 100 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await accountController.withdraw(req, res, next);

      // Verify next was called with the error
      expect(next).toHaveBeenCalledWith(new Error("Service error"));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
