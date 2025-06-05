const Joi = require('joi');

const authSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const noteSchema = Joi.object({
    title: Joi.string().max(50).required(),
    text: Joi.string().max(300).required(),
});

const validateAuth = (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateNote = (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateAuth,
    validateNote
};