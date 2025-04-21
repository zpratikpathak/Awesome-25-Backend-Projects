const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToOriginalUrl, getUrlStats } = require('../controllers/urlController');
const rateLimiter = require('../middleware/rateLimiter');

// Create a short URL
router.post('/shorten', rateLimiter, createShortUrl);

// Get URL statistics
router.get('/stats/:code', getUrlStats);

// Redirect to original URL
router.get('/:code', redirectToOriginalUrl);

module.exports = router;