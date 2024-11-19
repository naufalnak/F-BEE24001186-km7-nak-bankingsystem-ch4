const nodemailer = require("nodemailer");
const fs = require("fs");
const process = require("process");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  service: "gmail",
  // host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const loadTemplate = (templatePath, replacements) => {
  const template = fs.readFileSync(templatePath, "utf-8");
  return template.replace(
    /{{(.*?)}}/g,
    (_, key) => replacements[key.trim()] || ""
  );
};

class Email {
  static async sendEmail(to, subject, templatePath, replacements) {
    const html = loadTemplate(templatePath, replacements);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    return transporter.sendMail(mailOptions);
  }
}

module.exports = Email;
