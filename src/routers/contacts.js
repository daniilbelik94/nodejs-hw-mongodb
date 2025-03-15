import express from 'express';
import Contact from '../models/contact.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { contactSchema, updateContactSchema } from '../schemas/contactSchema.js';

const router = express.Router();

// GET /contacts
router.get('/', async (req, res) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const pageNumber = parseInt(page);
    const perPageNumber = parseInt(perPage);

    const filter = {};
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPageNumber);
    const skip = (pageNumber - 1) * perPageNumber;

    const sortCriteria = {};
    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await Contact.find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(perPageNumber);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: pageNumber,
        perPage: perPageNumber,
        totalItems,
        totalPages,
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
});

// GET /contacts/:contactId
router.get('/:contactId', isValidId, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
});

// POST /contacts
router.post('/', validateBody(contactSchema), async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
});

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully deleted contact!',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
});

// PATCH /contacts/:contactId
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
});

export default router;