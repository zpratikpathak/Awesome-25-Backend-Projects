const express = require('express');
const { randomUUID } = require('node:crypto');

const app = express();
app.use(express.json({ limit: '16kb' }));

// Mock BullMQ queue processing
const notifications = [];

app.post('/notify', (req, res) => {
  const { userId, message } = req.body || {};
  if (typeof userId !== 'string' || !userId.trim() || userId.length > 64 || typeof message !== 'string' || !message.trim() || message.length > 2000) return res.status(400).json({ error: 'Invalid userId or message' });
  if (notifications.length >= 1000) return res.status(503).json({ error: 'Demo queue full; restart to clear' });
  const job = { id: randomUUID(), userId, message, status: 'queued' };
  notifications.push(job);
  
  // Simulate processing async
  setTimeout(() => {
    const j = notifications.find(n => n.id === job.id);
    if (j) {
      j.status = 'sent';
    }
  }, 2000);
  
  res.status(202).json({ jobId: job.id, status: 'queued' });
});

app.get('/status/:id', (req, res) => {
  const job = notifications.find(n => n.id === req.params.id);
  if (job) res.json(job);
  else res.status(404).json({ error: 'Job not found' });
});

const PORT = process.env.PORT || 3000;
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
if (require.main === module) app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
