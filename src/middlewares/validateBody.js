import Joi from 'joi';
import createHttpError from 'http-errors';

const validateBody = (schema) => {
  return (req, res, next) => {
    // Если тело отсутствует, пропускаем валидацию
    if (!req.body || Object.keys(req.body).length === 0) {
      return next();
    }

    const { error } = schema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }
    next();
  };
};

export default validateBody;