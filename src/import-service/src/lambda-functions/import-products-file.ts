import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { headers } from '../../../../constants/headers';
import { bucketName, region } from '../constants/constants';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  console.log(`httpMethod:${event.httpMethod}; path: ${event.path}; queryStringParameters: ${event.queryStringParameters};`);

  try {
    const fileName = event.queryStringParameters.name;
    if (!fileName) {
      return {
        headers,
        statusCode: 400,
        body: JSON.stringify({
          errorMessage: 'Invalid fileName'
        })
      };
    }

    const s3 = new AWS.S3({region: region});
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucketName,
      Key: `uploaded/${fileName}`,
      Expires: 120,
      ContentType: 'text/csv',
    });

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(url)
    };
  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
      body: JSON.stringify({
        errorMessage: 'Internal Server Error'
      })
    }
  }
};
