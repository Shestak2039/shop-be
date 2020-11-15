import 'source-map-support/register';
import { getProductsList } from './src/lambda-functions/get-products-list';
import { getProductById } from './src/lambda-functions/get-product-by-id';
import { createProduct } from './src/lambda-functions/create-product';

export { getProductsList, getProductById, createProduct };
