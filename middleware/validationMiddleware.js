import Joi from 'joi';

// Joi schema for user registration and login input
const authSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
});

/**
 * Middleware for validating user authentication input (signup/login).
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const validateAuth = (req, res, next) => {
    // Validate the request body against the authSchema
    const { error } = authSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next(); 
};

// Joi schema for note creation and update input
const noteSchema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    text: Joi.string().min(1).max(300).required(),
});

/**
 * Middleware for validating note input (create/update).
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const validateNote = (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export { validateAuth, validateNote };
