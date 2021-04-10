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
  socket.emit("sendmessage", {client: clientName, msg: msg.value}, (error) => {
    // this callback is for acknowledgement from the receiver
    if(error) {
      return console.log(error);
    }

    console.log('Message Received');
  });
}

document.querySelector("#share-location")
  .addEventListener('click', () => {
    if(!navigator.geolocation) 
      return alert("Sharing Location is not supported in your browser");

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude }, () => {
        console.log('Location Shared!');
      });
    });
  });