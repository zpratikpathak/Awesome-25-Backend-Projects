import express from 'express';

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 2, name: 'Phone', category: 'Electronics', price: 699.99 },
  { id: 3, name: 'Desk', category: 'Furniture', price: 199.99 }
];

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(products);
  
  const results = products.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase()) || 
    p.category.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
