const service = require('../services/postService');

exports.list = (req, res) => res.json(service.getPosts());
exports.create = (req, res) => res.status(201).json(service.createPost(req.body));
