import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productService from '../services/product.service';
import { headers } from '../constants/headers';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const { id } = event.pathParameters;

        const product = await productService.findById(id);

        if (!product) {
            return {
                headers,
                statusCode: 204,
                body: JSON.stringify({errorMessage: 'Product not found'})
            }
        }

        return {
            headers,
            statusCode: 200,
            body: JSON.stringify(product)
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
