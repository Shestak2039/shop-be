import 'source-map-support/register';
import productService from '../services/product.service';
import * as AWS from 'aws-sdk';

export const catalogBatchProcess = async (event) => {
    try {
        const products = event.Records
            .map(record => {
                return JSON.parse(record.body)
            })
            .map(product => ({
                title: product.title,
                description: product.description,
                price: +product.price,
                count: +product.count,
                imageUrl: product.imageUrl
            }));

        if (isValidProducts(products)) {
            await Promise.all(
                products.map(async (product) => {
                    return await productService.createProduct(product);
                })
            ).then(async createdProducts => {
                const sns = new AWS.SNS({region: process.env.REGION});
                console.log('process.env.SNS_ARN', process.env.SNS_ARN)

                await Promise.all(
                    createdProducts.map(async product => {
                        return await sns.publish({
                            Subject: 'New product',
                            Message: `${createdProducts}`,
                            TopicArn: process.env.SNS_ARN,
                            MessageAttributes: {
                                filter: {
                                    DataType: 'String',
                                    // @ts-ignore
                                    StringValue: product.price > 10 ? 'more' : 'less',
                                },
                            },
                        }).promise();
                    })
                );
            });
        }
    } catch (e) {
        console.log(e);

        const sns = new AWS.SNS({region: process.env.REGION});

        return sns.publish({
            Subject: 'New products',
            Message: 'Something went wrong',
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
                filter: {
                    DataType: 'String',
                    StringValue: 'more',
                },
            },
        }).promise();
    }
};

function isValidProducts(products) {
    return products.every((product => product.title
        && product.description
        && product.price
        && product.count
        && product.imageUrl));
}
