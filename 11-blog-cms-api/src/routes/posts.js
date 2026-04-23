const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController');
const { validatePost } = require('../middleware/validation');

router.get('/', controller.list);
router.post('/', validatePost, controller.create);

module.exports = router;
