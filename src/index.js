import dotenv from 'dotenv';
import path from 'path';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import net from 'net';

if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(process.cwd(), '.env');
  console.log(`Loading .env from ${envPath}`);
  dotenv.config({ path: envPath });
}

async function start() {
  console.log('Loading environment variables...');
  console.log('PORT:', process.env.PORT);
  console.log('MONGODB_USER:', process.env.MONGODB_USER);
  console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD ? '[REDACTED]' : undefined);
  console.log('MONGODB_URL:', process.env.MONGODB_URL);
  console.log('MONGODB_DB:', process.env.MONGODB_DB);

  if (
    !process.env.PORT ||
    !process.env.MONGODB_USER ||
    !process.env.MONGODB_PASSWORD ||
    !process.env.MONGODB_URL ||
    !process.env.MONGODB_DB
  ) {
    throw new Error('Missing required environment variables');
  }

  console.log('Initializing MongoDB connection...');
  await initMongoConnection();
  console.log('MongoDB connection established, setting up server...');

  const app = setupServer();
  const PORT = process.env.PORT || 3000;

  // Проверка, свободен ли порт
  const server = net.createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Exiting...`);
      process.exit(1);
    } else {
      console.error('Unexpected error while checking port:', err);
      process.exit(1);
    }
  });

  server.once('listening', () => {
    server.close(); // Закрываем тестовый сервер
    console.log(`Port ${PORT} is free, starting Express server...`);

    // Запускаем Express-сервер
    const appServer = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });

    // Обработка завершения процесса
    process.on('SIGINT', () => {
      console.log('SIGINT received. Closing server...');
      appServer.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Closing server...');
      appServer.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  });

  server.listen(PORT);
}

start().catch(err => {
  console.error('Application startup error:', err);
  process.exit(1);
});