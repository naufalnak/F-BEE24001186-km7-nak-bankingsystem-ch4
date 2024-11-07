const prisma = require("../config/prisma");

class Account {
  async createAccount(data) {
    return await prisma.bankAccount.create({ data });
  }

  async getAllAccounts() {
    return await prisma.bankAccount.findMany();
  }

  async getAccountById(accountId) {
    return await prisma.bankAccount.findUnique({
      where: { account_id: parseInt(accountId) },
    });
  }

  async getAccountsByUserId(userId) {
    return await prisma.bankAccount.findMany({
      where: { user_id: userId },
    });
  }

  async deposit(accountId, amount) {
    return await prisma.bankAccount.update({
      where: { account_id: parseInt(accountId) },
      data: { balance: { increment: amount } },
    });
  }

  async withdraw(accountId, amount) {
    return await prisma.bankAccount.update({
      where: { account_id: parseInt(accountId) },
      data: { balance: { decrement: amount } },
    });
  }
}

module.exports = new Account();
