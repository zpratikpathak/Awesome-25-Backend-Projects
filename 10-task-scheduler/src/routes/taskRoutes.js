const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask } = require('../middleware/validationMiddleware');

router.post('/', validateTask, taskController.scheduleTask);
router.get('/', taskController.getTasks);

module.exports = router;
