require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const filter = new Filter();
/* When express and socket package are used together in one application, then the above refracting of code is needed.
Bcoz configuration of socket requires raw http created server whereas when we create server by directly using express then the 
app variable contains lots of other stuff associated with it, hence it can't be used to configure socket.  */

const {
  PORT = 3000
} = process.env;

app.use(express.static('public'));

let welcomeMsg = "Welcome to chat room!!";

/*
  socket.emit => send message to itself
  socket.broadcast.emit() => send message to everyone except itself
  io.emit() => send message to everyone
*/

io.on('connection', (socket) => {

  // When a new user joins
  socket.on('join', ({ username, room }, callback) => {
    // Adding user to the user array
    const { user, error } = addUser({ id: socket.id, username, room });
    
    // handing error (if any acknowledge the client using callback)
    if(error) {
      return callback(error);
    }
    
    // creates a different channel or room
    socket.join(user.room);
    socket.emit('message', generateMessage('Admin', welcomeMsg));
    
    // send the message to all the sockets except itself inside the given room.
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room!`));

    // Update Userlist
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    // acknowledge the client without - stating no error
    callback();
  });

  // message event - For receiving message from the client
  // Note: callback is also passed for acknowledgement
  socket.on('message', (message, callback) => {
    if (filter.isProfane(message)) {
      // check if the received message has some bad words or profanity
      return callback('Profanity is not allowed');
    }

    const user = getUser(socket.id);

    // emit message to all the sockets
    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('shareLocation', (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('shareLocation', generateLocationMessage(user.username, coords));

    callback();
  });

  socket.on('disconnect', () => {
    // Remove user from the user array
    const user = removeUser(socket.id);
    console.log(user);
    
    if(user) {
      // If the user is actually being removed then acknowledge
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room`));
    
      // Update Userlist
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(PORT, () => (
  console.log('Server is listening at PORT ' + PORT)
));