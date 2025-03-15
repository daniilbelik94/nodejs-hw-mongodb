import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phone: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20).required(),
  contactType: Joi.string().min(3).max(20).required(),
  isFavourite: Joi.boolean().default(false),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phone: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  contactType: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
}).or('name', 'phone', 'email', 'contactType', 'isFavourite'); 

export { contactSchema, updateContactSchema };