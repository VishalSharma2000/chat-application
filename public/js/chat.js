const socket = io();
/* The above function is available in /socket.io/socket.io.js script file by socket.io library */

// Elements
const msgInput = document.querySelector("#userMsg");
const sendMsgBtn = document.querySelector("#sendMsg");
const shareLocationBtn = document.querySelector('#share-location');

socket.on('message', message => {
  console.log("Message from Server: ", message);
})

const sendMessage = (event) => {
  event.preventDefault();

  sendMsgBtn.disabled = true;
  console.log('Message: ', msgInput.value);

  /* send msg to all connected user */
  socket.emit("sendmessage", msgInput.value, (error) => {
    sendMsgBtn.disabled = false;
    msgInput.value = '';
    msgInput.focus();

    // this callback is for acknowledgement from the receiver
    if (error) {
      return console.log(error);
    }

    console.log('Message Received');
  });
}

// share location
shareLocationBtn.addEventListener('click', () => {
  shareLocationBtn.disabled = true;
  if (!navigator.geolocation)
    return alert("Sharing Location is not supported in your browser");

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, () => {
      shareLocationBtn.disabled = false;
      console.log('Location Shared!');
    });
  });
});