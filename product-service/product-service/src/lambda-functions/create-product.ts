import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productService from '../services/product.service';
import { headers } from '../constants/headers';

export const createProduct: APIGatewayProxyHandler = async (event) => {
    console.log(`httpMethod: ${event.httpMethod}; path: ${event.path}; body: ${event.body};`);

    try {
        const body = event.body;

        const createdProduct = await productService.createProduct(JSON.parse(body));

        if (createdProduct) {
            return {
                headers,
                statusCode: 200,
                body: JSON.stringify(createdProduct)
            };
        } else {
            return {
                headers,
                statusCode: 500,
                body: JSON.stringify({
                    errorMessage: 'Something went wrong'
                })
            };
        }
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
