const { v4: generateId } = require('uuid');
const dynamodb = require('@aws-sdk/client-dynamodb');

const client = new dynamodb.DynamoDBClient({
  region: 'us-east-1',
});

function addNewTopic(topicData) {
  const cmd = new dynamodb.PutItemCommand({
    Item: {
      Id: generateId(),
      Title: topicData.title,
      User: topicData.user,
      Statement: topicData.statement,
    },
    TableName: 'Topics',
  });
  return client.send(cmd);
}

function addNewOpinion(topicId, opinionData) {
  const cmd = new dynamodb.PutItemCommand({
    Item: {
      TopicId: topicId,
      CreationDate: new Date().toISOString(),
      Title: opinionData.title,
      User: opinionData.user,
      Text: opinionData.text,
    },
    TableName: 'Opinions',
  });
  return client.send(cmd);
}

async function getTopics() {
  const cmd = new dynamodb.ScanCommand({
    TableName: 'Topics',
  });

  const response = await client.send(cmd);
  const items = response.Items;
  console.log(items);

  return items;
}

async function getTopic(id) {
  const cmd = new dynamodb.GetItemCommand({
    Key: {
      Id: id,
    },
    TableName: 'Topics',
  });

  const response = await client.send(cmd);
  const topicData = response.Item;

  const cmd2 = new dynamodb.GetItemCommand({
    Key: {
      Id: id,
    },
    TableName: 'Opinions',
  });

  const response2 = await client.send(cmd2);
  const opinions = response2.Item;

  const topic = {
    id: topicData.Id,
    title: topicData.Title,
    statement: topicData.Statement,
    user: topicData.User,
    opinions: opinions.map((opinion) => ({
      id: opinion.TopicId + opinion.CreationDate,
      title: opinion.Title,
      user: opinion.User,
      text: opinion.Text,
    })),
  };

  return topic;
}

exports.addNewTopic = addNewTopic;
exports.addNewOpinion = addNewOpinion;
exports.getTopics = getTopics;
exports.getTopic = getTopic;
