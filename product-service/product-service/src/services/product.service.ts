import { ProductModel } from '../models/product.model';
import { productsList } from '../data/products-list';

export class ProductService {
    productsList: ProductModel[] = productsList;

    async findById(id: string) {
        const product = await this.productsList.find(productData => productData.id === id);

        return product;
    }

    async findAll() {
        return this.productsList;
    }
}

export default new ProductService();
