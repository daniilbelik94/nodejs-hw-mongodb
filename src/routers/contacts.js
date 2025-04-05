import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactSchema, updateContactSchema } from '../schemas/contactSchema.js';
import {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';

const router = express.Router();

// GET /contacts
router.get('/', authenticate, ctrlWrapper(listContacts));

// GET /contacts/:contactId
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactById));

// POST /contacts
router.post('/', authenticate, validateBody(contactSchema), ctrlWrapper(createContact));

// DELETE /contacts/:contactId
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContact));

// PATCH /contacts/:contactId
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);

export default router;