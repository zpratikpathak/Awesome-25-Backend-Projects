const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

router.post('/shorten', urlController.shorten);
router.get('/:id', urlController.redirect);

module.exports = router;
