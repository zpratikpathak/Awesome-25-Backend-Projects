import express from 'express';

const app = express();
app.use(express.json());

// Mock DB
let posts = [];
let idCounter = 1;

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', (req, res) => {
  const post = { id: idCounter++, ...req.body, createdAt: new Date() };
  posts.push(post);
  res.status(201).json(post);
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) res.json(post);
  else res.status(404).json({ error: 'Not found' });
});

app.put('/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body, updatedAt: new Date() };
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/posts/:id', (req, res) => {
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
