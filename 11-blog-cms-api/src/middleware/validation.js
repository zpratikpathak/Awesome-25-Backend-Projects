const { z } = require('zod');
const schema = z.object({ title: z.string().trim().min(3).max(200), content: z.string().trim().min(10).max(50000) });

exports.validatePost = (req, res, next) => {
    try { req.body = schema.parse(req.body); next(); }
    catch (e) { res.status(400).json({ errors: e.issues }); }
};
