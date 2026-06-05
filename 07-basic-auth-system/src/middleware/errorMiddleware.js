const logger = require('../utils/logger');
exports.errorHandler = (err, req, res, next) => {
    logger.error(err.message);
    const status = err.status || 500;
    res.status(status).json({ error: status < 500 ? err.message : 'Internal Server Error' });
};
