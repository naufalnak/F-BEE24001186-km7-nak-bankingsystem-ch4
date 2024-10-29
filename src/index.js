const express = require("express");
const swaggerJSON = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");
const user = require("./routes/user");
const account = require("./routes/account");
const transaction = require("./routes/transaction");
const auth = require("./routes/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Use the API routes
app.use("/api/v1", user);
app.use("/api/v1", account);
app.use("/api/v1", transaction);
app.use("/api/v1", auth);

app.use(errorHandler);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
