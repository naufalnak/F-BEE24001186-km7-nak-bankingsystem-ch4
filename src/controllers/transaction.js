const TransactionService = require("../services/transaction");

class TransactionController {
  static async createTransaction(req, res, next) {
    try {
      const transaction = await TransactionService.createTransaction(req.body);
      return res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactions(req, res, next) {
    try {
      const transactions = await TransactionService.getTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    const { transactionId } = req.params;
    try {
      const transaction = await TransactionService.getTransactionById(
        transactionId
      );

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
