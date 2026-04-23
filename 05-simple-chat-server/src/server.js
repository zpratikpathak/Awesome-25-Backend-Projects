require('dotenv').config();
const server = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Chat Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
