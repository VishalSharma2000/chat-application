require('dotenv').config();
const express = require('express');

const app = express();

const {
  PORT = 3000
} = process.env;

app.get('/', (req, res) => {
  res.send('working');
})

app.listen(PORT, () => (
  console.log('Server is listening at PORT ' + PORT)
));