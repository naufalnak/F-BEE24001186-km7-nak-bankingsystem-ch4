const prisma = require("../config/prisma");

class TransactionController {
  static async createTransaction(req, res, next) {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      const sourceAccount = await prisma.bankAccount.findUnique({
        where: { account_id: source_account_id },
      });

      const destinationAccount = await prisma.bankAccount.findUnique({
        where: { account_id: destination_account_id },
      });

      if (!sourceAccount || !destinationAccount) {
        return res
          .status(404)
          .json({ message: "Source or Destination account not found" });
      }

      if (sourceAccount.balance < amount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance in source account" });
      }

      const transaction = await prisma.transaction.create({
        data: {
          source_account_id,
          destination_account_id,
          amount,
        },
      });

      await prisma.bankAccount.update({
        where: { account_id: source_account_id },
        data: { balance: sourceAccount.balance - amount },
      });

      await prisma.bankAccount.update({
        where: { account_id: destination_account_id },
        data: { balance: destinationAccount.balance + amount },
      });

      return res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactions(req, res, next) {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
      });
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    const { transactionId } = req.params;
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { transaction_id: Number(transactionId) },
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
