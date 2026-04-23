const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

exports.validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

exports.validateLogin = (req, res, next) => {
    const { error } = registerSchema.validate(req.body); // Same schema for login
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};
