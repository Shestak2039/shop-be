import { catalogBatchProcess } from '../src/lambda-functions/catalog-batch-process';
import * as AWSMock from 'aws-sdk-mock';
import productService from '../src/services/product.service';

describe('handler.catalogBatchProcess', () => {
    it('should create product', async () => {
        const validProduct = {
            count: 10,
            description: "abc",
            price: 10,
            title: "Witcher",
            src: "https://aaaa.com",
        };

        AWSMock.mock('SNS', 'publish', {promise: () => {}});

        const mockFn = spyOn(productService, 'createProduct');

        await catalogBatchProcess({
            Records: [{ body: JSON.stringify(validProduct) }]
        });

        return expect(mockFn).toHaveBeenCalled();
    });

    it('should return nothing',async () => {
        const invalid = {
            count: 10,
            description: "abc",
            price: 10,
        };

        AWSMock.mock('SNS', 'publish', {promise: () => {}});

        productService.createProduct = jest.fn();

        return expect(await catalogBatchProcess({
            Records: [{ body: JSON.stringify(invalid) }],
        })).toBe(undefined);
    });
});
