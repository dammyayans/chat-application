const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const PORT = process.env.port || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const user = addUser({ id: socket.id, name, room });
    if (user.error) return callback(user.error);
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room`,
    });
    socket.broadcast
      .to(user.name)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });
    socket.join(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.name,
      user: getUsersInRoom(user.room),
    });
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.name).emit({ user: "admin", text: `${user.name} has left` });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`server has started on prot ${PORT}`));
