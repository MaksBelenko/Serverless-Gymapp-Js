async function addTraining(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();

  const training = {
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(training),
  };
}

export const handler = addTraining;


