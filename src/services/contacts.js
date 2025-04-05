import Contact from '../models/contact.js';

async function getAllContacts(userId) {
  return await Contact.find({ userId });
}

async function getContactById(contactId, userId) {
  return await Contact.findOne({ _id: contactId, userId });
}

async function createContact(contactData, userId) {
  return await Contact.create({ ...contactData, userId });
}

async function updateContact(contactId, updateData, userId) {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true }
  );
}

async function deleteContact(contactId, userId) {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
}

export { getAllContacts, getContactById, createContact, updateContact, deleteContact };