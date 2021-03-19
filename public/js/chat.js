const socket = io();
/* The above function is available in /socket.io/socket.io.js script file by socket.io library */

const chats = document.querySelector("#chats");
socket.on('message', (message = {}) => {
  let oldMsgs = chats.innerHTML;
  console.log('Message Received: ',message);

  oldMsgs += `${message.client} : ${message.msg}<br />`;

  chats.innerHTML = oldMsgs;
});

let clientName = "";

const registerMe = () => {
  clientName = document.querySelector("#clientName").value;
}

const sendMessage = (event) => {
  event.preventDefault();

  const msg = document.querySelector("#userMsg");
  console.log('Message: ',msg.value, "Client Name: ", clientName);
  socket.emit("message", {client: clientName, msg: msg.value});
}