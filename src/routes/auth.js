const path = require("path");
const express = require("express");
const router = express.Router();

const Auth = require("../controllers/auth");
const AuthMiddleware = require("../middlewares/auth");

router.post("/login", Auth.login);
router.post("/forgot-password", Auth.forgotPassword);
router.post("/reset-password", Auth.resetPassword);

router.get("/reset-password", (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname, "../templates/resetPassword.html"));
});

router.post(
  "/change-password",
  AuthMiddleware.changePassword,
  Auth.changePassword
);

module.exports = router;
