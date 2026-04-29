const crypto = require('crypto');
const urlModel = require('../models/url.model');

class UrlService {
  shortenUrl(originalUrl) {
    let id;
    do { id = crypto.randomBytes(8).toString('hex'); } while (urlModel.findById(id));
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
