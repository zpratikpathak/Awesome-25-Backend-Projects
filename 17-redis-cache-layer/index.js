import express from 'express';

const app = express();
// Using a mock memory cache instead of real redis for standalone runnable project
const cache = new Map();

const mockDataFetch = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, data: `Expensive data for ${id}`, timestamp: Date.now() }), 1000);
  });
};

app.get('/data/:id', async (req, res) => {
  const { id } = req.params;
  
  if (cache.has(id)) {
    return res.json({ source: 'cache', data: cache.get(id) });
  }
  
  const data = await mockDataFetch(id);
  cache.set(id, data);
  res.json({ source: 'db', data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
