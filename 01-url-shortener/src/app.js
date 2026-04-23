const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/url.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

app.use(errorHandler);

module.exports = app;
