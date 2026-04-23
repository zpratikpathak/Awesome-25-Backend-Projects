const logger = require('../utils/logger');
exports.errorHandler = (err, req, res, next) => {
    logger.error(err.message);
    const status = err.message.includes('Invalid credentials') ? 401 : 400;
    res.status(status).json({ error: err.message });
};
