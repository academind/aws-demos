const s3 = require('@aws-sdk/client-s3');

const client = new s3.S3Client();

async function streamToString(stream) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

exports.handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectName = event.Records[0].s3.object.key;
  const cmd = new s3.GetObjectCommand({
    Bucket: bucketName,
    Key: objectName,
  });
  const response = await client.send(cmd);
  const data = await streamToString(response.Body);
  console.log(data); // print content of file
};
