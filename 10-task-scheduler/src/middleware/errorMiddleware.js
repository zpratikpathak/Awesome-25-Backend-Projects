const logger = require('../utils/logger');
exports.errorHandler = (err, req, res, next) => {
    const status = err.status === 400 || err.status === 413 ? err.status : 500;
    logger.error(status === 500 ? 'Internal server error' : 'Invalid request body');
    res.status(status).json({ error: status === 500 ? 'Internal server error' : 'Invalid request body' });
};
