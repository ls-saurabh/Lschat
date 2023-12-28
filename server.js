const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const users = {};

io.on('connection', function (socket) {
  console.log(`User with ID ${socket.id} connected`);

  socket.on('join', function () {
    users[socket.id] = true;
    console.log(`User with ID ${socket.id} joined`);
  });

  socket.on('message', function (data) {
    const { message, to } = data;

    if (to && users[to]) {
      io.to(to).emit('message', { message, from: socket.id });
    } else if (to === 'stranger') {
      const strangers = Object.keys(users).filter((id) => id !== socket.id);
      if (strangers.length > 0) {
        const randomStranger = strangers[Math.floor(Math.random() * strangers.length)];
        io.to(randomStranger).emit('message', { message, from: socket.id });
      } else {
        console.log('No available strangers');
      }
    } else {
      console.log(`Invalid recipient: ${to}`);
    }
  });

  socket.on('disconnect', function () {
    delete users[socket.id];
    console.log(`User with ID ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 3000;

// Change this line to listen on all network interfaces
server.listen(PORT, '0.0.0.0', function () {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
