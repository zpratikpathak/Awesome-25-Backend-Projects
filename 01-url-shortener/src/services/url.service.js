const crypto = require('crypto');
const urlModel = require('../models/url.model');

class UrlService {
  shortenUrl(originalUrl) {
    const id = crypto.randomBytes(4).toString('hex');
    urlModel.save(id, originalUrl);
    return id;
  }

  getOriginalUrl(id) {
    const originalUrl = urlModel.findById(id);
    if (!originalUrl) {
      const error = new Error('URL not found');
      error.status = 404;
      throw error;
    }
    return originalUrl;
  }
}

module.exports = new UrlService();
