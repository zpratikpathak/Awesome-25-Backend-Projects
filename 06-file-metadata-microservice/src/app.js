const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/file', uploadRoutes);

app.use(errorHandler);

module.exports = app;
