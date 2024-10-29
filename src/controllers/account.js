const prisma = require("../config/prisma");

class AccountController {
  static async createAccount(req, res, next) {
    try {
      const { user_id, bank_name, bank_account_number, balance } = req.body;

      const account = await prisma.bankAccount.create({
        data: {
          user_id,
          bank_name,
          bank_account_number,
          balance,
        },
      });

      return res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  }

  static async getAccounts(req, res, next) {
    try {
      const accounts = await prisma.bankAccount.findMany();
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  }

  static async getAccountById(req, res, next) {
    try {
      const { accountId } = req.params;
      const account = await prisma.bankAccount.findUnique({
        where: { account_id: parseInt(accountId) },
      });

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      res.status(200).json(account);
    } catch (error) {
      next(error);
    }
  }

  static async getAccount(req, res) {
    try {
      const accounts = await prisma.bankAccount.findMany({
        where: { user_id: req.user.user_id },
      });

      res.status(200).json(accounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal mengambil akun bank" });
    }
  }

  static async deposit(req, res, next) {
    try {
      const { accountId } = req.params;
      const { amount } = req.body;

      if (amount <= 0) {
        return res
          .status(400)
          .json({ message: "Deposit amount must be positive" });
      }

      const account = await prisma.bankAccount.findUnique({
        where: { account_id: parseInt(accountId) },
      });

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const updatedAccount = await prisma.bankAccount.update({
        where: { account_id: parseInt(accountId) },
        data: { balance: { increment: amount } },
      });

      return res.status(200).json(updatedAccount);
    } catch (error) {
      next(error);
    }
  }

  static async withdraw(req, res, next) {
    try {
      const { accountId } = req.params;
      const { amount } = req.body;

      if (amount <= 0) {
        return res
          .status(400)
          .json({ message: "Withdrawal amount must be positive" });
      }

      const account = await prisma.bankAccount.findUnique({
        where: { account_id: parseInt(accountId) },
      });

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      if (account.balance < amount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance for withdrawal" });
      }

      const updatedAccount = await prisma.bankAccount.update({
        where: { account_id: parseInt(accountId) },
        data: { balance: { decrement: amount } },
      });

      res.status(200).json(updatedAccount);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AccountController;
