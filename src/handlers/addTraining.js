import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

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

    await dynamodb.put({
        TableName: process.env.GYMSCHEDULE_TABLE_NAME,
        Item: training,
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(training),
    };
}

export const handler = addTraining;
