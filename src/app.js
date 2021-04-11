require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
/* When express and socket package are used together in one application, then the above refracting of code is needed.
Bcoz configuration of socket requires raw http created server whereas when we create server by directly using express then the 
app variable contains lots of other stuff associated with it, hence it can't be used to configure socket.  */

const {
  PORT = 3000
} = process.env;

app.use(express.static('public'));

let message = "Welcome to chat room!!";

io.on('connection', (socket) => {
  socket.emit('message', message);
  socket.broadcast.emit('message', 'A new user has joined');

  socket.on('sendmessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', message)
    callback();
  });

  socket.on('shareLocation', (coords, callback) => {
    io.emit('shareLocation', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);

    callback();
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', 'A user has left the chat room');
  });
});

server.listen(PORT, () => (
  console.log('Server is listening at PORT ' + PORT)
));