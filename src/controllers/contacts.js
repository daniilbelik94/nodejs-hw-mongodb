import createHttpError from 'http-errors';
import Contact from '../models/contact.js';

export const listContacts = async (req, res) => {
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
};

export const getContactById = async (req, res) => {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    })
  }
  

export const createContact = async (req, res) => {

    const contact = await Contact.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  }

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
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

export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
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