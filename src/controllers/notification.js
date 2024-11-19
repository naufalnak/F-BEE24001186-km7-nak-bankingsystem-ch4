const { sendNotification } = require("../config/socket");

class Notification {
  static async sendWelcomeNotification(email) {
    sendNotification("welcome", {
      message: `Welcome to the platform, ${email}!`,
    });
  }

  static async sendPasswordUpdateNotification(email) {
    sendNotification("passwordUpdate", {
      message: `Password for ${email} has been updated!`,
    });
  }
}

module.exports = Notification;
