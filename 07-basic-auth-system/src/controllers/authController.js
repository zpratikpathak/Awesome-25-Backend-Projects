const authService = require('../services/authService');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body.username, req.body.password);
        logger.info(`User registered: ${user.username}`);
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const token = await authService.login(req.body.username, req.body.password);
        logger.info(`User logged in: ${req.body.username}`);
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
