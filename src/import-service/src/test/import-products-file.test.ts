import { importProductsFile } from '../lambda-functions/import-products-file';
import * as AWSMock from 'aws-sdk-mock';
import {headers} from "../../../../constants/headers";

describe('handler.importProductsFile', () => {
    it('should return signed url', async () => {
        const mockSignedUrl = 'signed-url';
        const event = {
            queryStringParameters: {name: 'test.csv'}
        } as any;

        AWSMock.mock('S3', 'getSignedUrl', mockSignedUrl);

        return expect(await importProductsFile(event, null, null)).toEqual({
            statusCode: 200,
            headers,
            body: mockSignedUrl
        });
    });

    it('should return bad request',async () => {
        const mockSignedUrl = 'signed-url';
        const event = {
            queryStringParameters: {}
        } as any;

        AWSMock.mock('S3', 'getSignedUrl', mockSignedUrl);

        return expect(await importProductsFile(event, null, null)).toEqual({
            headers,
            statusCode: 400,
            body: JSON.stringify({
                errorMessage: 'Invalid fileName'
            })
        });
    });
});
