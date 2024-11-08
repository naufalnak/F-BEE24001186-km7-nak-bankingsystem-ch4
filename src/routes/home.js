// routes/home.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 10px; }
            a { text-decoration: none; color: #0066cc; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <h1>Welcome to API Bank System</h1>
        <h2>Credits: Naufal Andresya Kholish - BEJS 1</h2>
        <br>
        <h2>API Information</h2>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Status:</strong> Stable</p>
        <p>For full documentation, visit <a href="http://ec2-3-1-85-79.ap-southeast-1.compute.amazonaws.com/docs" target="_blank"> API Documentation</a>.</p>
    </body>
    </html>
  `);
});

module.exports = router;
