const express = require("express");
const AccountController = require("../controllers/account");
const { validateAccount } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/accounts", validateAccount, AccountController.createAccount);
router.get("/accounts", AccountController.getAccounts);
router.get("/accounts/:accountId", AccountController.getAccountById);
router.put(
  "/accounts/:accountId",
  validateAccount,
  AccountController.updateAccount
);
router.delete("/accounts/:accountId", AccountController.deleteAccount);

module.exports = router;
