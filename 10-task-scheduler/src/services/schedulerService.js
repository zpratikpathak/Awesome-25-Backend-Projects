const cron = require('node-cron');
const taskService = require('./taskService');
const logger = require('../utils/logger');

cron.schedule('* * * * *', () => {
    logger.info('Scheduler tick: evaluating tasks...');
    const tasks = taskService.getAllTasks();
    tasks.forEach(t => logger.info(`Evaluating task ${t.name}`));
});
