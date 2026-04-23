const { z } = require('zod');
const schema = z.object({ title: z.string().min(3), content: z.string().min(10) });

exports.validatePost = (req, res, next) => {
    try { schema.parse(req.body); next(); }
    catch (e) { res.status(400).json({ errors: e.errors }); }
};
