import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import createHttpError from 'http-errors';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';

function setupServer() {
  const app = express();

  console.log('Setting up middleware...');
  app.use(cors());
  console.log('CORS middleware applied');

  app.use(express.json());
  app.use(cookieParser());
  console.log('Cookie parser middleware applied');
  console.log('express.json middleware applied');

  app.use((req, res, next) => {
    if (['POST', 'PATCH'].includes(req.method) && req.headers['content-type'] !== 'application/json') {
      return next(createHttpError(400, 'Content-Type must be application/json'));
    }
    next();
  });
  console.log('Content-Type check middleware applied');

  app.use(pino());
  console.log('Pino logger middleware applied');

  // убираю ошибку 404 на рендере
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Welcome to the Contacts API!',
      endpoints: {
        contacts: '/contacts', // путь в документации
      },
    });
  });

  console.log('Setting up /contacts route...');
  app.use('/contacts', contactsRouter); // Убрал /api

  app.use('/auth', authRouter);
  console.log('Setting up /auth route...');

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