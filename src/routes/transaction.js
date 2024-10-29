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

module.exports = router;
