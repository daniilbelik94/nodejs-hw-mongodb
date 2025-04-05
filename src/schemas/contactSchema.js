import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(3).max(20).required(), 
  email: Joi.string().email().min(3).max(30).required(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(), 
  isFavourite: Joi.boolean().default(false),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(30),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean(),
}).or('name', 'phoneNumber', 'email', 'contactType', 'isFavourite');

export { contactSchema, updateContactSchema };