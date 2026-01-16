const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 1. Serve the HTML file when someone visits the site
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 2. Listen for connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // When the server receives a 'chat message' from one person...
  socket.on('chat message', (msg) => {
    // ...it sends that message back to EVERYONE connected
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Use the port the cloud gives us, OR use 3000 if we are on localhost
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});