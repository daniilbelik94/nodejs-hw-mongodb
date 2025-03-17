import express from 'express';
import { listContacts, getContactById, createContact, deleteContact, updateContact } from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { contactSchema, updateContactSchema } from '../schemas/contactSchema.js';

const router = express.Router();

// GET /contacts
router.get('/', listContacts);

// GET /contacts/:contactId
router.get('/:contactId', isValidId, getContactById);

// POST /contacts
router.post('/', validateBody(contactSchema), createContact);

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, deleteContact);

// PATCH /contacts/:contactId
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContact);

export default router;