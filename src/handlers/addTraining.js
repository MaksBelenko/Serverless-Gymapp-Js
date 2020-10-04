import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addTraining(event, context) {
    const { title } = JSON.parse(event.body);
    const now = new Date();

    const training = {
        id: uuid(),
        title,
        status: 'PLACES_AVAILABLE',
        createdAt: now.toISOString(),
    };

    try {
        await dynamodb
            .put({
                TableName: process.env.GYMSCHEDULE_TABLE_NAME,
                Item: training,
            })
            .promise();
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(training),
    };
}

export const handler = middy(addTraining)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
