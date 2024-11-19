const http = require("http");
const app = require("./index");
const dotenv = require("dotenv");
const process = require("process");

dotenv.config();
const { initializeSocket, socket } = require("./config/socket");

// Buat server HTTP menggunakan Express
const server = http.createServer(app);

const io = socket(server);

app.use((req, res, next) => {
  res.locals.io = io;
  next();
});

// Inisialisasi Socket.IO
initializeSocket(server);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
