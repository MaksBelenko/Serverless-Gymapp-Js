import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getSingleAuction(id) {
    let training;

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

    return training;
}

async function getTrainingById(event, context) {
    const { id } = event.pathParameters;
    const training = await getSingleAuction(id);

    return {
        statusCode: 200,
        body: JSON.stringify(training),
    };
}

export const handler = commonMiddleware(getTrainingById);
