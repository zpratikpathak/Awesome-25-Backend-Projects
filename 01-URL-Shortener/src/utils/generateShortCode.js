const { nanoid } = require('nanoid');

/**
 * Generate a unique short code for URLs
 * @param {number} length - Length of the short code, default is 7
 * @returns {string} - Generated short code
 */
const generateShortCode = (length = 7) => {
  return nanoid(length);
};

module.exports = { generateShortCode };