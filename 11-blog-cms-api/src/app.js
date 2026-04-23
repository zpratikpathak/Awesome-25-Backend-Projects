const express = require('express');
const { errorHandler } = require('./middleware/error');
const postRoutes = require('./routes/posts');

const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use(errorHandler);

module.exports = app;
