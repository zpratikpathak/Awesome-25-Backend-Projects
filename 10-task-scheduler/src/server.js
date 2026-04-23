require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
require('./services/schedulerService'); // Init scheduler

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Task Scheduler running on port ${PORT}`));
