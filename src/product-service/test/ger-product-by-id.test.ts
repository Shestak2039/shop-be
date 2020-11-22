import { getProductById } from '../src/lambda-functions/get-product-by-id';
import createEvent from '@serverless/event-mocks/dist';
import productService from '../src/services/product.service';
import { headers } from '../../../constants/headers';

describe('getProductById.handler', () => {
    test('should return correct product', async () => {
       const mockEvent = createEvent('aws:apiGateway', {
           pathParameters: {
               id: '7567ec4b-b10c-48c5-9345-fc73c48a80a2'
           }
       } as any);

       const mockProduct = {
           count: 10,
           description: "Grand Theft Auto V",
           id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
           price: 20,
           title: "Grand Theft Auto V",
           imageUrl: "https://upload.wikimedia.org/wikipedia/ru/thumb/c/c8/GTAV_Official_Cover_Art.jpg/274px-GTAV_Official_Cover_Art.jpg"
       };

       // @ts-ignore
        return expect(await getProductById(mockEvent)).toEqual({
            headers,
            statusCode: 200,
            body: JSON.stringify(mockProduct)
        })
    });
    test('should return not found', async () => {
        const mockEvent = createEvent('aws:apiGateway', {
            pathParameters: {
                id: '123'
            }
        } as any);

        const mockProduct = {
            count: 10,
            description: "Grand Theft Auto V",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
            price: 20,
            title: "Grand Theft Auto V",
            imageUrl: "https://upload.wikimedia.org/wikipedia/ru/thumb/c/c8/GTAV_Official_Cover_Art.jpg/274px-GTAV_Official_Cover_Art.jpg"
        };

        const mockProducts = [mockProduct];

        // @ts-ignore
        productService.productsList = mockProducts;

        // @ts-ignore
        return expect(await getProductById(mockEvent)).toEqual({
            headers,
            statusCode: 204,
            body: JSON.stringify({errorMessage: 'Product not found'})
        })
    });
    test('should return error', async () => {
        const mockEvent = createEvent('aws:apiGateway', {
            pathParameters: {
                id: '123'
            }
        } as any);

        productService.findById = jest.fn(() => {throw new Error('Error')});

        // @ts-ignore
        return expect(await getProductById(mockEvent)).toEqual({
            statusCode: 500,
            body: JSON.stringify({
                errorMessage: 'Internal Server Error'
            })
        })
    })
});
