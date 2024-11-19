const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
};

const sendNotification = (event, data) => {
  if (io) io.emit(event, data);
};

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = { initializeSocket, sendNotification, socket };
