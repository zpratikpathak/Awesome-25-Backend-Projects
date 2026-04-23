const crypto = require('crypto');
const tasks = [];

exports.createTask = (data) => {
    const task = {
        id: crypto.randomUUID(),
        name: data.name,
        cron: data.cron,
        status: 'pending'
    };
    tasks.push(task);
    return task;
};

exports.getAllTasks = () => tasks;
