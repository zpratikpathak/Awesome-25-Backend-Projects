import express from 'express';

const app = express();
app.use(express.json());

// Mock BullMQ queue processing
const notifications = [];

app.post('/notify', (req, res) => {
  const { userId, message } = req.body;
  const job = { id: Date.now(), userId, message, status: 'queued' };
  notifications.push(job);
  
  // Simulate processing async
  setTimeout(() => {
    const j = notifications.find(n => n.id === job.id);
    if (j) {
      j.status = 'sent';
      console.log(`Notification sent to ${userId}: ${message}`);
    }
  }, 2000);
  
  res.status(202).json({ jobId: job.id, status: 'queued' });
});

app.get('/status/:id', (req, res) => {
  const job = notifications.find(n => n.id === parseInt(req.params.id));
  if (job) res.json(job);
  else res.status(404).json({ error: 'Job not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
