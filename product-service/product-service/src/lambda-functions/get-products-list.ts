import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productService from '../services/product.service';
import { headers } from '../constants/headers';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
    console.log(`httpMethod: ${event.httpMethod}; path: ${event.path};`);

    try {
        const products = await productService.findAll();

        return {
            headers,
            statusCode: 200,
            body: JSON.stringify(products)
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
