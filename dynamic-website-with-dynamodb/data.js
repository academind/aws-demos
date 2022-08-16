const { v4: generateId } = require('uuid');
const dynamodb = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new dynamodb.DynamoDBClient({
  region: 'us-east-1',
});
const ddbDocClient = new DynamoDBDocumentClient(client);

function addNewTopic(topicData) {
  const cmd = new PutCommand({
    Item: {
      Id: generateId(),
      Title: topicData.title,
      User: topicData.user,
      Statement: topicData.statement,
    },
    TableName: 'Topics',
  });
  return ddbDocClient.send(cmd);
}

function addNewOpinion(topicId, opinionData) {
  const cmd = new PutCommand({
    Item: {
      TopicId: topicId,
      CreationDate: new Date().toISOString(),
      Title: opinionData.title,
      User: opinionData.user,
      Text: opinionData.text,
    },
    TableName: 'Opinions',
  });
  return ddbDocClient.send(cmd);
}

async function getTopics() {
  const cmd = new ScanCommand({
    TableName: 'Topics',
  });

  const response = await ddbDocClient.send(cmd);
  const items = response.Items;
  console.log(items);

  return items.map((item) => ({
    title: item.Title,
    user: item.User,
    id: item.Id,
    statement: item.Statement,
  }));
}

async function getTopic(id) {
  const cmd = new GetCommand({
    Key: {
      Id: id,
    },
    TableName: 'Topics',
  });

  const response = await ddbDocClient.send(cmd);
  const topicData = response.Item;

  const cmd2 = new QueryCommand({
    KeyConditions: {
      TopicId: {
        AttributeValueList: [id],
        ComparisonOperator: 'EQ'
      },
    },
    TableName: 'Opinions',
  });

  const response2 = await ddbDocClient.send(cmd2);
  const opinions = response2.Items;

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
