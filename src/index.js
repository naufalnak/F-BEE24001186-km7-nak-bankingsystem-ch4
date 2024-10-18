const express = require("express");
const user = require("./routes/user");
const account = require("./routes/account");
const transaction = require("./routes/transaction");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Use the API routes
app.use("/api/v1", user);
app.use("/api/v1", account);
app.use("/api/v1", transaction);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT :${PORT}`);
});
