const multer = require('multer');
const storage = multer.memoryStorage();
exports.uploadMiddleware = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0, parts: 2 } });
