import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTrainingById(event, context) {
    let training;
    const { id } = event.pathParameters;

    try {
        const result = await dynamodb
            .get({
                TableName: process.env.GYMSCHEDULE_TABLE_NAME,
                Key: { id },
            })
            .promise();

        training = result.Item;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!training) {
        throw new createError.NotFound(`Training with ID "${id}" not found!`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(training),
    };
}

export const handler = middy(getTrainingById)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
