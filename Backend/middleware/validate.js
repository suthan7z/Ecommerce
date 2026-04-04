const { ValidationError } = require('joi');

// Middleware to validate request body against a Joi schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Format validation errors
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = validate;