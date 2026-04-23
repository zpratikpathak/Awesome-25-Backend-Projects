const { z } = require('zod');

const taskSchema = z.object({
    name: z.string().min(1),
    cron: z.string().min(5)
});

exports.validateTask = (req, res, next) => {
    try {
        taskSchema.parse(req.body);
        next();
    } catch (e) {
        res.status(400).json({ error: e.errors });
    }
};
