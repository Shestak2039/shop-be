import 'source-map-support/register';
import { S3Event } from 'aws-lambda';
import * as csv from "csv-parser";
import * as AWS from 'aws-sdk';
import { headers } from '../../../../constants/headers';
import { bucketName, region } from '../constants/constants';

export const importFileParser = async (event: S3Event) => {
  try {
    const s3 = new AWS.S3({region: region});
    const sqs = new AWS.SQS({region: region});

    for (let record of event.Records) {
      const { key } = record.s3.object;
      await new Promise((res) => {
        s3.getObject({
          Bucket: bucketName,
          Key: key
        })
          .createReadStream()
          .pipe(csv())
          .on('data', (data) => {
            console.log('data', data)
            sqs.sendMessage({
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(data)
            }, (err, data) => {
              if (err) {
                console.log('Error', err);
                return;
              }
              console.log('Success', data)
            })
          })
          .on('end', async() => {
            await s3.copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${key}`,
              Key: key.replace('uploaded', 'parsed')
            }).promise();

            await s3.deleteObject({
              Bucket: bucketName,
              Key: key
            }).promise();

            res();
          })
      });
    }

    return {
      headers,
      statusCode: 200
    }
  } catch (e) {
    console.log(e);

    return {
      headers,
      statusCode: 500,
      body: JSON.stringify({
        errorMessage: 'Internal Server Error'
      })
    }
  }
};
