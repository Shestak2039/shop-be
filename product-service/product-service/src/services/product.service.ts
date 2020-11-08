import { ProductModel } from '../models/product.model';
import productInstance from '../models/product';

export class ProductService {
    async findById(id: string) {
        const product = await productInstance.findProductById(id);

        return product;
    }

    async findAll() {
        const products = await productInstance.getAllProducts();

        return products;
    }

    async createProduct(product: ProductModel) {
        const createdProduct = await productInstance.createProduct(product);

        return createdProduct;
    }
}

export default new ProductService();
