const path = require('node:path');

const express = require('express');

const app = express();

app.use(express.static('public', { maxAge: 10 * 60 * 1000 }));

app.get('/', function (req, res) {
  const filePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(filePath, { maxAge: 2 * 60 * 1000 });
});

app.listen(3000);
