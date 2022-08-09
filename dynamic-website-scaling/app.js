const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({ message: 'Success!' });
});

app.post('/data', function (req, res) {
  const data = req.body;

  let sum = 0;

  for (let i = 0; i < 100000; i++) {
    // dummy process to make the web app work harder
    sum += i;
  }

  res
    .status(201)
    .json({ message: 'Received dummy data.', submitted: data, sum });
});

app.listen(3000);
