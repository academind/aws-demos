const express = require('express');
const bodyParser = require('body-parser');

const {
  getTopics,
  getTopic,
  addNewTopic,
  addNewOpinion,
} = require('./data');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.redirect('/topics');
});

app.get('/topics', async function (req, res) {
  const topics = await getTopics();
  res.render('index', { topics: topics });
});

app.get('/topics/:id', async function (req, res) {
  const topicId = req.params.id;
  const topic = await getTopic(topicId);
  res.render('topic', { topic: topic });
});

app.post('/topic', async function (req, res) {
  const topicData = req.body;
  await addNewTopic(topicData);
  res.redirect('/topics');
});

app.post('/share-opinion', async function (req, res) {
  const submittedData = req.body;
  const topicId = submittedData['topic-id'];
  const opinionData = {
    title: submittedData.title,
    user: submittedData.user,
    text: submittedData.text,
  };
  await addNewOpinion(topicId, opinionData);
  res.redirect(`/topics/${topicId}`);
});

app.listen(3000);