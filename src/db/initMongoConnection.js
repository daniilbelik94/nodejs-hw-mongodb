const mongoose = require('mongoose');

async function initMongoConnection() {
  const uri = 'mongodb+srv://dbelik664:rTOWrXxtb0PiUqIP@cluster0.g69v9.mongodb.net/contacts_db?retryWrites=true&w=majority';

  try {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
}

module.exports = initMongoConnection;