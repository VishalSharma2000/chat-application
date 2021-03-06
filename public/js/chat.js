const socket = io();
/* The above function is available in /socket.io/socket.io.js script file by socket.io library */

// Elements
const msgInput = document.querySelector("#userMsg");
const sendMsgBtn = document.querySelector("#sendMsg");
const shareLocationBtn = document.querySelector('#share-location');
const msgs = document.querySelector("#msgs");
const sidebar = document.querySelector(".chat__sidebar");

// Template
const msgTemplate = document.querySelector("#mustache-message-template").innerHTML;
const locationTemplate = document.querySelector("#mustache-location-template").innerHTML;
const sidebarTemplate = document.querySelector('#mustache-sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search.substr(1));

socket.on('message', message => {
  console.log("Message: ", message);

  renderMessage(msgTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('hh:mm a'),
  }, msgs);
});

socket.on('shareLocation', location => {
  console.log('Location: ', location);

  renderMessage(locationTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format('hh:mm a'),
  }, msgs);
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });

  sidebar.innerHTML = html;
})

const renderMessage = (template, value, target) => {
  const html = Mustache.render(template, value);

  target.insertAdjacentHTML("beforeend", html);
};

const sendMessage = (event) => {
  event.preventDefault();

  // validations
  if (msgInput.value === '')
    return;

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

socket.emit('join', { username, room }, (error) => {
  if(error) {
    alert(error);
    location.href = '/';
  }
});