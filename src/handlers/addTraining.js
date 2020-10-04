import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addTraining(event, context) {
    const { title, numberOfPlaces } = JSON.parse(event.body);
    const now = new Date();

    const training = {
        id: uuid(),
        title,
        status: 'PLACES_AVAILABLE',
        createdAt: now.toISOString(),
        placesAvailable: {
            numberOfPlaces: numberOfPlaces,
        },
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

export const handler = commonMiddleware(addTraining);
