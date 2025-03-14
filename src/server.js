import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json()); // Додаємо парсинг JSON
  app.use(pino());

  console.log('Setting up /contacts route...'); // Додаємо лог для діагностики
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