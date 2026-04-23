const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

module.exports = app;
