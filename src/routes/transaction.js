const express = require("express");
const TransactionController = require("../controllers/transaction");
const { validateTransaction } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post(
  "/transactions",
  validateTransaction,
  TransactionController.createTransaction
);
router.get("/transactions", TransactionController.getTransactions);
router.get(
  "/transactions/:transactionId",
  TransactionController.getTransactionById
);
router.put(
  "/transactions/:transactionId",
  validateTransaction,
  TransactionController.updateTransaction
); // PUT endpoint
router.delete(
  "/transactions/:transactionId",
  TransactionController.deleteTransaction
); // DELETE endpoint

module.exports = router;
