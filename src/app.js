require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

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

app.get('/', (req, res) => {
  res.send('working');
});

io.on('connection', () => {
  console.log('Client connected to server');
});

server.listen(PORT, () => (
  console.log('Server is listening at PORT ' + PORT)
));