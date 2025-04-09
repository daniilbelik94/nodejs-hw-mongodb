import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(), 
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  isFavourite: Joi.boolean().default(false),
  photo: Joi.any().optional(), 
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30), 
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean(),
  photo: Joi.any().optional(), 
}).min(1); 

export { contactSchema, updateContactSchema };


