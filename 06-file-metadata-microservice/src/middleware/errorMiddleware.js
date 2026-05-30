const logger = require('../utils/logger');
const multer = require('multer');

exports.errorHandler = (err, req, res, next) => {
    logger.error(err.message);
    const status = err instanceof multer.MulterError ? (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400) : err.status || 500;
    res.status(status).json({
        error: status < 500 ? err.message : 'Internal Server Error'
    });
};
