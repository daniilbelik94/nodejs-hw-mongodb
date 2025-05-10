import Contact from '../models/contact.js';

async function getAllContacts() {
  return await Contact.find();
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function createContact(contactData) {
  return await Contact.create(contactData);
}

async function updateContact(contactId, updateData) {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
}

async function deleteContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}

export { getAllContacts, getContactById, createContact, updateContact, deleteContact };