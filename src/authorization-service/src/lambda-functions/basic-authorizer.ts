import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler} from 'aws-lambda';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _context, callback) => {
    console.log('Event: ', JSON.stringify(event));

    if (event.type !== 'TOKEN') {
        callback('Unauthorized');
    }

    try {
        const token = event.authorizationToken;
        const [, encodedCreds] = token.split(' ');
        const buffer = Buffer.from(encodedCreds, 'base64');
        const [username, password] = buffer.toString('utf-8').split(':');

        console.log(`username: ${username} and password: ${password}`);

        const storedUserPassword = process.env[username];
        const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        callback(null, policy);
    } catch (e) {
        console.log('Error: ', e);
        callback('Unauthorized');
    }
};

const generatePolicy = (principalId: string, resource: string, effect = 'Deny'): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                }
            ]
        }
    };
};
