import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify();

app.get('/', async () => ({ message: 'hello world' }));

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
