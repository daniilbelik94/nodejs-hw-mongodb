import createHttpError from 'http-errors';
import {
  getAllContacts as getAllContactsService,
  getContactById as getContactByIdService,
  createContact as createContactService,
  updateContact as updateContactService,
  deleteContact as deleteContactService,
} from '../services/contacts.js';

export const listContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const pageNumber = parseInt(page);
    const perPageNumber = parseInt(perPage);

    const userId = req.user._id;
    const filter = { userId };
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const contacts = await getAllContactsService(userId, filter, {
      page: pageNumber,
      perPage: perPageNumber,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactByIdService(contactId, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await createContactService(req.body, userId);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await updateContactService(contactId, req.body, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await deleteContactService(contactId, userId);
    if (!contact) {
      throw createHttpError(204);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};