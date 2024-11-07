const express = require("express");
const AccountController = require("../controllers/account");
const {
  validateAccount,
  validateDepositWithdraw,
} = require("../middlewares/validationMiddleware");
const AuthMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/accounts", AccountController.getAccounts);
router.get("/accounts/:accountId", AccountController.getAccountById);
router.get(
  "/getAccountMiddleware",
  AuthMiddleware.authenticate,
  AccountController.getAccountMiddlewareAuth
);

router.post("/accounts", validateAccount, AccountController.createAccount);
router.post(
  "/accounts/:accountId/deposit",
  validateDepositWithdraw,
  AccountController.deposit
);
router.post(
  "/accounts/:accountId/withdraw",
  validateDepositWithdraw,
  AccountController.withdraw
);

module.exports = router;
