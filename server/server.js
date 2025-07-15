import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' },
});

app.use(cors());

let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    onlineUsers.set(socket.id, username);
    io.emit('online-users', [...onlineUsers.values()]);
  });

  socket.on('send-message', (msg) => {
    io.emit('receive-message', {
      text: msg.text,
      sender: msg.sender,
      time: new Date(),
    });
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('online-users', [...onlineUsers.values()]);
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
