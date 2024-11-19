const prisma = require("../../config/prisma");
const accountService = require("../../services/account");

jest.mock("../../config/prisma", () => ({
  bankAccount: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("AccountServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Done
  describe("createAccount", () => {
    it("should create a new bank account", async () => {
      // Mock data
      const mockData = {
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 1000,
      };
      const mockResponse = { id: 1, ...mockData };

      // Mock Prisma
      prisma.bankAccount.create.mockResolvedValue(mockResponse);

      // Call the service
      const result = await accountService.createAccount(mockData);

      // Verify the results
      expect(prisma.bankAccount.create).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if Prisma throws an error", async () => {
      // Mock Prisma to throw an error
      prisma.bankAccount.create.mockRejectedValue(new Error("Database error"));

      // Call the service and expect an error
      await expect(accountService.createAccount({})).rejects.toThrow(
        "Database error"
      );
    });
  });

  // Done
  describe("getAllAccounts", () => {
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

      // Mock Prisma
      prisma.bankAccount.findMany.mockResolvedValue(mockAccounts);

      // Call the service
      const result = await accountService.getAllAccounts();

      // Verify the results
      expect(prisma.bankAccount.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockAccounts);
    });

    it("should throw an error if Prisma throws an error", async () => {
      // Mock Prisma to throw an error
      prisma.bankAccount.findMany.mockRejectedValue(
        new Error("Database error")
      );

      // Call the service and expect an error
      await expect(accountService.getAllAccounts()).rejects.toThrow(
        "Database error"
      );
    });
  });

  // Done
  describe("getAccountById", () => {
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

      // Mock Prisma
      prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

      // Call the service
      const result = await accountService.getAccountById(accountId);

      // Verify the results
      expect(prisma.bankAccount.findUnique).toHaveBeenCalledWith({
        where: { account_id: accountId },
      });
      expect(result).toEqual(mockAccount);
    });

    it("should return null when the account does not exist", async () => {
      // Mock Prisma to return null
      prisma.bankAccount.findUnique.mockResolvedValue(null);

      // Call the service
      const result = await accountService.getAccountById(999); // ID yang tidak ada

      // Verify the results
      expect(result).toBeNull();
    });

    it("should throw an error if Prisma throws an error", async () => {
      // Mock Prisma to throw an error
      prisma.bankAccount.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      // Call the service and expect an error
      await expect(accountService.getAccountById(1)).rejects.toThrow(
        "Database error"
      );
    });
  });

  // Done
  describe("deposit", () => {
    it("should update the account balance and return the updated account", async () => {
      // Mock data
      const accountId = 1;
      const amount = 100;
      const mockUpdatedAccount = {
        account_id: accountId,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 1100,
      };

      // Mock Prisma
      prisma.bankAccount.update.mockResolvedValue(mockUpdatedAccount);

      // Call the service
      const result = await accountService.deposit(accountId, amount);

      // Verify the results
      expect(prisma.bankAccount.update).toHaveBeenCalledWith({
        where: { account_id: accountId },
        data: { balance: { increment: amount } },
      });
      expect(result).toEqual(mockUpdatedAccount);
    });

    it("should throw an error if Prisma throws an error", async () => {
      // Mock Prisma to throw an error
      prisma.bankAccount.update.mockRejectedValue(new Error("Database error"));

      // Call the service and expect an error
      await expect(accountService.deposit(1, 100)).rejects.toThrow(
        "Database error"
      );
    });
  });

  // Done
  describe("withdraw", () => {
    it("should update the account balance and return the updated account", async () => {
      // Mock data
      const accountId = 1;
      const amount = 100;
      const mockUpdatedAccount = {
        account_id: accountId,
        user_id: 1,
        bank_name: "Bank ABC",
        bank_account_number: "1234567890",
        balance: 900,
      };

      // Mock Prisma
      prisma.bankAccount.update.mockResolvedValue(mockUpdatedAccount);

      // Call the service
      const result = await accountService.withdraw(accountId, amount);

      // Verify the results
      expect(prisma.bankAccount.update).toHaveBeenCalledWith({
        where: { account_id: accountId },
        data: { balance: { decrement: amount } },
      });
      expect(result).toEqual(mockUpdatedAccount);
    });

    it("should throw an error if Prisma throws an error", async () => {
      // Mock Prisma to throw an error
      prisma.bankAccount.update.mockRejectedValue(new Error("Database error"));

      // Call the service and expect an error
      await expect(accountService.withdraw(1, 100)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
