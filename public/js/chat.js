const socket = io();
/* The above function is available in /socket.io/socket.io.js script file by socket.io library */

// Elements
const msgInput = document.querySelector("#userMsg");
const sendMsgBtn = document.querySelector("#sendMsg");
const shareLocationBtn = document.querySelector('#share-location');
const msgs = document.querySelector("#msgs");

// Template
const msgTemplate = document.querySelector("#mustache-message-template").innerHTML;
const locationTemplate = document.querySelector("#mustache-location-template").innerHTML;

socket.on('message', message => {
  console.log("Message: ", message);

  renderMessage(msgTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('hh:mm a'),
  }, msgs);
});

socket.on('shareLocation', location => {
  console.log('Location: ', location);

  renderMessage(locationTemplate, { location }, msgs);
})

const renderMessage = (template, value, target) => {
  const html = Mustache.render(template, value);

  target.insertAdjacentHTML("beforeend", html);
};

const sendMessage = (event) => {
  event.preventDefault();

  sendMsgBtn.disabled = true;

  /* send msg to all connected user */
  socket.emit("message", msgInput.value, (error) => {
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
    socket.emit("shareLocation", { latitude, longitude }, () => {
      shareLocationBtn.disabled = false;
      console.log('Location Shared!');
    });
  });
});