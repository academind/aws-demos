const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({ message: 'Success!' });
});

app.post('/data', function (req, res) {
  const data = req.body;
  res.status(201).json({ message: 'Received dummy data.', data });
});

app.listen(3000);
