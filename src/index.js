import dotenv from 'dotenv';
import path from 'path';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(process.cwd(), '.env');
  dotenv.config({ path: envPath });
}

async function start() {
  console.log('Loading environment variables...');
  console.log('PORT:', process.env.PORT);
  console.log('MONGODB_USER:', process.env.MONGODB_USER);
  console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD);
  console.log('MONGODB_URL:', process.env.MONGODB_URL);
  console.log('MONGODB_DB:', process.env.MONGODB_DB);

  if (!process.env.PORT || !process.env.MONGODB_USER || !process.env.MONGODB_PASSWORD || !process.env.MONGODB_URL || !process.env.MONGODB_DB) {
    throw new Error('Missing required environment variables');
  }

  await initMongoConnection();
  setupServer();
}

start().catch(err => {
  console.error('Application startup error:', err);
  process.exit(1);
});