import 'source-map-support/register';
import { getProductsList } from './src/lambda-functions/get-products-list';
import { getProductById } from './src/lambda-functions/get-product-by-id';

export { getProductsList, getProductById };
