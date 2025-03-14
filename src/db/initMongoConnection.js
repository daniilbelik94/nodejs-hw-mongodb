import mongoose from 'mongoose';

async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

  console.log('MONGODB_USER:', MONGODB_USER);
  console.log('MONGODB_PASSWORD:', MONGODB_PASSWORD);
  console.log('MONGODB_URL:', MONGODB_URL);
  console.log('MONGODB_DB:', MONGODB_DB);

  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
  console.log('Connection URI:', uri);

  try {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
}

export default initMongoConnection;