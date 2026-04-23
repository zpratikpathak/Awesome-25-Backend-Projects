const logger = require('../utils/logger');
const metadataService = require('../services/metadataService');

exports.handleFileUpload = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const metadata = metadataService.extractMetadata(req.file);
        logger.info('File uploaded and metadata extracted');
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};
