const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- CONFIGURATION ---
const port = process.env.PORT || 3000;
const ROOM_PASSWORD = "monkey123"; // <--- CHANGE THIS TO YOUR SECRET PASSWORD

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let isLoggedIn = false;
  let userNickname = "Anonymous";

  // 1. Verify Password when someone tries to join
  socket.on('login request', (data) => {
    if (data.pass === ROOM_PASSWORD) {
      // Success!
      isLoggedIn = true;
      userNickname = data.name;
      socket.emit('login success'); // Tell frontend to show chat
      io.emit('chat message', `--- ${userNickname} joined the room ---`);
      console.log(`${userNickname} logged in.`);
    } else {
      // Fail!
      socket.emit('login fail');
    }
  });

  // 2. Only allow messages if they are logged in
  socket.on('chat message', (msg) => {
    if (isLoggedIn) {
      io.emit('chat message', `${userNickname}: ${msg}`);
    }
  });

  socket.on('disconnect', () => {
    if (isLoggedIn) {
      io.emit('chat message', `--- ${userNickname} left ---`);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});