import { getProductsList } from '../src/lambda-functions/get-products-list';
import productService from '../src/services/product.service';
import { ProductModel } from '../src/models/product.model';
import { headers } from '../../../constants/headers';

describe('getProductsList.handler', () => {
   test('should return productsList', async () => {
       const mockProducts: ProductModel[] = [
           {
               count: 10,
               description: "Grand Theft Auto V",
               id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
               price: 20,
               title: "Grand Theft Auto V",
               imageUrl: "https://upload.wikimedia.org/wikipedia/ru/thumb/c/c8/GTAV_Official_Cover_Art.jpg/274px-GTAV_Official_Cover_Art.jpg"
           }
       ];

       // @ts-ignore
       productService.productsList = mockProducts;

       // @ts-ignore
       return expect(await getProductsList()).toEqual({
           headers,
           statusCode: 200,
           body: JSON.stringify(mockProducts)
       })
   });
   test('should return error', async () => {
       productService.findAll = jest.fn(() => {throw new Error('Error')});

       // @ts-ignore
       return expect(await getProductsList()).toEqual({
           statusCode: 500,
           body: JSON.stringify({
               errorMessage: 'Internal Server Error'
           })
       })
   });
});
