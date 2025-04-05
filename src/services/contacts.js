import Contact from '../models/contact.js';

async function getAllContacts(userId, filter = {}, options = {}) {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' } = options;

  const pageNumber = parseInt(page);
  const perPageNumber = parseInt(perPage);

  const queryFilter = { userId, ...filter };
  const totalItems = await Contact.countDocuments(queryFilter);
  const totalPages = Math.ceil(totalItems / perPageNumber);
  const skip = (pageNumber - 1) * perPageNumber;

  const sortCriteria = {};
  sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const contacts = await Contact.find(queryFilter)
    .sort(sortCriteria)
    .skip(skip)
    .limit(perPageNumber);

  return {
    data: contacts,
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  };
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