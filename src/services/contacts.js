import Contact from '../models/contact.js';

async function getAllContacts() {
  return await Contact.find();
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export { getAllContacts, getContactById };