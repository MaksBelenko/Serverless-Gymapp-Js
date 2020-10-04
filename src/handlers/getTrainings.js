import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTrainings(event, context) {
    let trainings;

    try {
        const result = await dynamodb.scan({
            TableName: process.env.GYMSCHEDULE_TABLE_NAME,
        }).promise();

        trainings = result.Items;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(trainings),
    };
}

export const handler = commonMiddleware(getTrainings);
