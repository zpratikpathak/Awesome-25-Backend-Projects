const multer = require('multer');
const storage = multer.memoryStorage();
exports.uploadMiddleware = multer({ storage });
