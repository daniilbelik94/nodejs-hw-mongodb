import createHttpError from 'http-errors';
import { getAllContacts as getAllContactsService, getContactById as getContactByIdService, createContact as createContactService, updateContact as updateContactService, deleteContact as deleteContactService } from '../services/contacts.js';

async function getAllContacts(req, res) {
  const contacts = await getAllContactsService();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContactById(req, res) {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

async function createContact(req, res) {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, 'name, phoneNumber, and contactType are required');
  }

  const newContact = await createContactService({ name, phoneNumber, email, isFavourite, contactType });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

async function updateContact(req, res) {
  const { contactId } = req.params;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, 'At least one field must be provided for update');
  }

  const updatedContact = await updateContactService(contactId, updateData);
  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

async function deleteContact(req, res) {
  const { contactId } = req.params;
  const deletedContact = await deleteContactService(contactId);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
}

export { getAllContacts, getContactById, createContact, updateContact, deleteContact };