import createHttpError from 'http-errors';
import { getAllContacts as getAllContactsService, getContactById as getContactByIdService, createContact as createContactService, updateContact as updateContactService, deleteContact as deleteContactService } from '../services/contacts.js';
import authenticate from '../middlewares/authenticate.js';


async function getAllContacts(req, res) {
  const contacts = await getAllContactsService();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export const getContactById = async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const listContacts = async (req, res) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const pageNumber = parseInt(page);
    const perPageNumber = parseInt(perPage);

    const filter = { userId: req.user._id };
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
        Contact: totalItems,
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
};

export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: contact,
    });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'Server error',
        error: error.message,
      });
    }
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.contactId,
      userId: req.user._id,
    });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'Server error',
        error: error.message,
      });
    }
  }
};

// Middleware to authenticate user
// Add authenticate middleware to all routes
router.get('/', authenticate, listContacts);
router.get('/:contactId', authenticate, isValidId, getContactById);
router.post('/', authenticate, validateBody(contactSchema), createContact);
router.delete('/:contactId', authenticate, isValidId, deleteContact);
router.patch('/:contactId', authenticate, isValidId, validateBody(updateContactSchema), updateContact);

export { getAllContacts, getContactById, createContact, updateContact, deleteContact };