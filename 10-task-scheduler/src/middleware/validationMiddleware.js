const { z } = require('zod');
const cron = require('node-cron');

const taskSchema = z.object({
    name: z.string().trim().min(1).max(200),
    cron: z.string().max(100).refine(value => cron.validate(value), 'Invalid cron expression')
});

exports.validateTask = (req, res, next) => {
    try {
        req.body = taskSchema.parse(req.body);
        next();
    } catch (e) {
        res.status(400).json({ error: e.issues });
    }
};
