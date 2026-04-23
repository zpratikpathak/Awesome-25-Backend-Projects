const taskService = require('../services/taskService');
const logger = require('../utils/logger');

exports.scheduleTask = (req, res, next) => {
    try {
        const task = taskService.createTask(req.body);
        logger.info(`Task scheduled: ${task.id}`);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

exports.getTasks = (req, res, next) => {
    res.json(taskService.getAllTasks());
};
