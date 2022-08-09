const mysql = require('mysql2/promise');

const connectionDetails = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let connection;

async function initDatabase() {
  connection = await mysql.createConnection(connectionDetails);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS topics (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      statement TEXT NOT NULL
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS opinions (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      topic_id INT UNSIGNED,
      FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
    )
  `);
}

function addNewTopic(topicData) {
  return connection.execute(
    `
    INSERT INTO topics (title, user, statement)
    VALUES (?, ?, ?)
  `,
    [topicData.title, topicData.user, topicData.statement]
  );
}

function addNewOpinion(topicId, opinionData) {
  return connection.execute(
    `
    INSERT INTO opinions (title, user, text, topic_id)
    VALUES (?, ?, ?, ?)
  `,
    [opinionData.title, opinionData.user, opinionData.text, topicId]
  );
}

async function getTopics() {
  const [rows] = await connection.execute(
    `
    SELECT * FROM topics ORDER BY id DESC
  `
  );

  console.log(rows);

  return rows;
}

async function getTopic(id) {
  const [rows] = await connection.execute(
    `
    SELECT t.id AS topic_id, t.title AS topic_title, t.statement AS topic_statement, t.user AS topic_user, o.id AS opinion_id, o.title AS opinion_title, o.user AS opinion_user, o.text AS opinion_text FROM topics t
    LEFT JOIN opinions o
    ON t.id = o.topic_id
    WHERE t.id = ?
  `,
    [id]
  );

  const topic = {
    id: rows[0].topic_id,
    title: rows[0].topic_title,
    statement: rows[0].topic_statement,
    user: rows[0].topic_user,
    opinions: [],
  };

  for (const row of rows) {
    if (row.opinion_id) {
      topic.opinions.push({
        id: row.opinion_id,
        title: row.opinion_title,
        user: row.opinion_user,
        text: row.opinion_text,
      });
    }
  }

  return topic;
}

exports.addNewTopic = addNewTopic;
exports.addNewOpinion = addNewOpinion;
exports.getTopics = getTopics;
exports.getTopic = getTopic;
exports.initDatabase = initDatabase;
