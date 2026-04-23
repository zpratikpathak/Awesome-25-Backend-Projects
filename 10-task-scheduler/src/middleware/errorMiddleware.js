const logger = require('../utils/logger');
exports.errorHandler = (err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
};
