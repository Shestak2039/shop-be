import dbOptions from '../config/db';
import { Client } from 'pg';
import { ProductModel } from './product.model';

class Product {
    async findProductById(id: string) {
        const client = new Client(dbOptions);

        try {
            await client.connect();

            const product = await client.query({
                text: `
                    SELECT id, title, price, description, imageurl, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id
                        WHERE id = $1;
                `,
                values: [id]
            });

            return product.rows[0];
        } catch (e) {
            console.log(e);
        } finally {
            await client.end();
        }
    }

    async getAllProducts() {
        const client = new Client(dbOptions);

        try {
            await client.connect();

            const products = await client.query(`
                SELECT id, title, price, description, imageurl, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id;
            `);

            return products.rows;
        } catch (e) {
            console.log(e);
        } finally {
            await client.end();
        }
    }

    async createProduct(product: ProductModel) {
        let client = new Client(dbOptions);

        try {
            await client.connect();

            await client.query('BEGIN');

            const createdProduct = await client.query({
                text: `
                    WITH first_insert as (
                        INSERT INTO products (title, description, price, imageURL)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id
                    )
                        INSERT INTO stocks (product_id, count)
                        VALUES
                        ( (SELECT id FROM first_insert), $5)
                        RETURNING (SELECT id FROM first_insert);`,
                values: [product.title, product.description, product.price, product.imageUrl, product.count]
            });

            await client.query('COMMIT');

            return {
                id: createdProduct.rows[0].id,
                price: product.price
            };
        } catch (e) {
            console.log(e);

            await client.query('ROLLBACK');
        } finally {
            await client.end();
        }
    }
}

export default new Product();
