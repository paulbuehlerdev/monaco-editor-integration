import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { copilotCompletion } from './copilot';
import type { CompletionRequestBody } from 'monacopilot';

const app = Fastify(
  {
    logger: true
  }
);

void app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
});

app.get('/', async () => ({ message: 'hello world' }));

app.post('/completion', async (request) => {
  return await copilotCompletion(request.body as CompletionRequestBody);
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4100;
    await app.listen({ port, host: "0.0.0.0"});
    console.log(`Server listening on http://0.0.0.0:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
