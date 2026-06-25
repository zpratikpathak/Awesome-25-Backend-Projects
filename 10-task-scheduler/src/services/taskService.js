const crypto = require('crypto');
const tasks = [];
const cron = require('node-cron');
const logger = require('../utils/logger');

exports.createTask = (data) => {
    const task = {
        id: crypto.randomUUID(),
        name: data.name,
        cron: data.cron,
        status: 'pending'
    };
    tasks.push(task);
    cron.schedule(task.cron, () => {
        task.status = 'completed';
        logger.info(`Executing task ${task.name}`);
    });
    return task;
};

exports.getAllTasks = () => tasks;
