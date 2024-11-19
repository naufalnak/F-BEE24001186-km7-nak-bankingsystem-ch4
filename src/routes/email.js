const express = require("express");
const Email = require("../config/nodemailer");

const router = express.Router();

router.post("/send-email", Email.sendEmail);

module.exports = router;
