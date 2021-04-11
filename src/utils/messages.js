const generateMessage = (text) => {
  return ({
    text,
    createdAt: new Date().getTime(),
  });
};

const generateLocationMessage = (coords) => {
  return ({
    url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
    createdAt: new Date().getTime(),
  });
};

module.exports = {
  generateMessage,
  generateLocationMessage
}