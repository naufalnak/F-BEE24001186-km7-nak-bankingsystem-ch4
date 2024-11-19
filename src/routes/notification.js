const express = require("express");
const {
  welcomeNotification,
  passwordChangeNotification,
} = require("../controllers/notification");

const router = express.Router();

router.post("/welcome", welcomeNotification);
router.post("/password-change", passwordChangeNotification);

module.exports = router;
