require("./middlewares/instrument");
const express = require("express");
const swaggerJSON = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");
const path = require("path");
const morgan = require("morgan");
const Sentry = require("@sentry/node");
const process = require("process");

const user = require("./routes/user");
const account = require("./routes/account");
const transaction = require("./routes/transaction");
const auth = require("./routes/auth");
const mediaRouter = require("./routes/media.routers");
const home = require("./routes/home");
const email = require("./routes/email");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the API routes
app.use("/", home);
app.use("/api/v1", user);
app.use("/api/v1", email);
app.use("/api/v1", account);
app.use("/api/v1", transaction);
app.use("/api/v1", auth);
app.use("/api/v1", mediaRouter);

app.use(
  "/notifications",
  express.static(path.join(process.cwd(), "src/templates"))
);

// app.use("/reset-password", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "resetPassword.html"));
// });

app.use(errorHandler);
Sentry.setupExpressErrorHandler(app);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

module.exports = app;
