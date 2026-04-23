const express = require('express');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();

// A simple task to log time every minute
cron.schedule('* * * * *', () => {
  const time = new Date().toISOString();
  const logMessage = `Task executed at ${time}\n`;
  
  console.log(logMessage.trim());
  
  // Also log to a file
  fs.appendFileSync(path.join(__dirname, 'task.log'), logMessage);
});

// A task that runs every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Running the 5-minute periodic database cleanup mock...');
});

app.get('/', (req, res) => {
  res.send('Task scheduler is running in the background. Check console and task.log!');
});

app.get('/logs', (req, res) => {
  const logPath = path.join(__dirname, 'task.log');
  if (fs.existsSync(logPath)) {
    const logs = fs.readFileSync(logPath, 'utf8');
    res.type('text/plain').send(logs);
  } else {
    res.send('No logs yet. Wait for a minute.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Scheduler server running on port ${PORT}`);
  console.log('Scheduled tasks:');
  console.log('- Every minute: Write to task.log');
  console.log('- Every 5 minutes: Mock database cleanup');
});