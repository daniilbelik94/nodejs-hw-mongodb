import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import createHttpError from 'http-errors';

function setupServer() {
  const app = express();

  console.log('Setting up middleware...');
  app.use(cors());
  console.log('CORS middleware applied');

  app.use(express.json());
  console.log('express.json middleware applied');

  // Додаємо middleware для перевірки Content-Type
  app.use((req, res, next) => {
    if (['POST', 'PATCH'].includes(req.method) && req.headers['content-type'] !== 'application/json') {
      return next(createHttpError(400, 'Content-Type must be application/json'));
    }
    next();
  });
  console.log('Content-Type check middleware applied');

  app.use(pino());
  console.log('Pino logger middleware applied');

  console.log('Setting up /contacts route...');
  app.use('/contacts', contactsRouter);

  console.log('Setting up notFoundHandler...');
  app.use(notFoundHandler);

  console.log('Setting up errorHandler...');
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;