import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function bookTraining(event, context) {
    const { id } = event.pathParameters;
    const { numberOfPlaces } = JSON.parse(event.body);

    const params = {
        TableName: process.env.GYMSCHEDULE_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set placesAvailable.numberOfPlaces = :numberOfPlaces',
        ExpressionAttributeValues: {
            ':numberOfPlaces': numberOfPlaces,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedTraining;

    try {
        const result = await dynamodb.update(params).promise();
        updatedTraining = result.Attributes;
    } catch (error) {
        console.log(`Error updating training with ${id}: ${error}`);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedTraining),
    };
}

export const handler = commonMiddleware(bookTraining);
