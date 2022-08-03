const path = require('path');
const fs = require('fs/promises');

const { v4: generateId } = require('uuid');

const dataStoragePath = path.join('/demo', 'data', 'data-storage.json');

async function loadStorageData() {
  const fileContent = await fs.readFile(dataStoragePath);
  const data = JSON.parse(fileContent);
  return data;
}

function saveStorageData(data) {
  const content = JSON.stringify(data);
  return fs.writeFile(dataStoragePath, content);
}

async function addNewTopic(topicData) {
  const newTopic = {
    id: generateId(),
    ...topicData,
    opinions: [],
  };
  const data = await loadStorageData();
  data.topics.unshift(newTopic); // unshift to add new topic at beginning
  saveStorageData(data);
}

async function addNewOpinion(topicId, opinionData) {
  console.log(opinionData);
  const newOpinion = {
    id: generateId(),
    ...opinionData
  };
  const data = await loadStorageData();
  const topicIndex = data.topics.findIndex((topic) => topic.id === topicId);
  const topicData = data.topics[topicIndex];
  topicData.opinions.unshift(newOpinion); // unshift to add new comment at beginning
  saveStorageData(data);
}

async function getTopics() {
  const data = await loadStorageData();
  const topics = data.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
  }));
  return topics;
}

async function getTopic(id) {
  const data = await loadStorageData();
  const topic = data.topics.find((topic) => topic.id === id);
  return topic;
}

exports.addNewTopic = addNewTopic;
exports.addNewOpinion = addNewOpinion;
exports.getTopics = getTopics;
exports.getTopic = getTopic;
