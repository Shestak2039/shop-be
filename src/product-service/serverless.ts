const serverlessConfiguration = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    documentation: {
      api: {
        info: {
          version: '1',
          title: 'Game Store API'
        }
      },
      models: [
        {
          name: 'Product',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              },
              description: {
                type: 'string'
              },
              price: {
                type: 'integer'
              },
              imageUrl: {
                type: 'string'
              },
              count: {
                type: 'integer'
              }
            },
            required: [
              'title',
              'description',
              'price',
              'imageUrl',
              'count'
            ]
          }
        },
        {
          name: 'MessageError',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
                description: 'Status code of error'
              },
              message: {
                type: 'string',
                description: 'Error message'
              }
            }
          }
        }
      ]
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin',
    'serverless-reqvalidator-plugin',
    'serverless-aws-documentation'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        Ref: 'SNSCreateProductTopic',
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': ['SQSCatalogItemsQueue', 'Arn'],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          {
            Ref: 'SNSCreateProductTopic',
          },
        ],
      },
    ],
  },
  functions: {
    products: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    product: {
      handler: 'handler.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'product/{id}',
            request: {
              parameters: {
                paths: {
                  id: true
                }
              }
            },
            cors: true
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'product',
            cors: true,
            reqValidatorName: 'BodyRequestValidator',
            documentation: {
              requestModels: {
                'application/json': 'Product'
              },
            },
            methodResponses: [
              {
                statusCode: '400',
                responseModels: {
                  'application/json': 'MessageError'
                }
              },
              {
                statusCode: '500',
                responseModels: {
                  'application/json': 'MessageError'
                }
              }
            ]
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['SQSCatalogItemsQueue', 'Arn'],
            }
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      BodyRequestValidator: {
        Type: 'AWS::ApiGateway::RequestValidator',
        Properties: {
          Name: 'BodyRequestValidator',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ValidateRequestBody: true,
          ValidateRequestParameters: false
        }
      },
      SQSCatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      SNSCreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'productTopic'
        }
      },
      SNSTopicSubscriptionPriceMore: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${self:provider.environment.SNS_EMAIL_FIRST}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSCreateProductTopic',
          },
          FilterPolicy: {
            filter: ['more']
          },
        },
      },
      SNSTopicSubscriptionPriceLess: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${self:provider.environment.SNS_EMAIL_SECOND}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSCreateProductTopic',
          },
          FilterPolicy: {
            filter: ['less']
          },
        },
      }
    },
    Outputs: {
      SQSUrl: {
        Value: {
          Ref: 'SQSCatalogItemsQueue'
        }
      },
      SQSArn: {
        Value: {
          'Fn::GetAtt': ['SQSCatalogItemsQueue', 'Arn']
        },
      },
    }
  }
};

module.exports = serverlessConfiguration;
