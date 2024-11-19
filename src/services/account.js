const prisma = require("../config/prisma");

class Account {
  static async createAccount(data) {
    return await prisma.bankAccount.create({ data });
  }

  static async getAllAccounts() {
    return await prisma.bankAccount.findMany();
  }

  static async getAccountById(accountId) {
    return await prisma.bankAccount.findUnique({
      where: { account_id: parseInt(accountId) },
    });
  }

  static async getAccountsByUserId(userId) {
    return await prisma.bankAccount.findMany({
      where: { user_id: userId },
    });
  }

  static async deposit(accountId, amount) {
    return await prisma.bankAccount.update({
      where: { account_id: parseInt(accountId) },
      data: { balance: { increment: amount } },
    });
  }

  static async withdraw(accountId, amount) {
    return await prisma.bankAccount.update({
      where: { account_id: parseInt(accountId) },
      data: { balance: { decrement: amount } },
    });
  }
}

module.exports = Account;
