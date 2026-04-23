import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url, selector } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });
  
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const result = [];
    
    $(selector || 'title').each((i, el) => {
      result.push($(el).text().trim());
    });
    
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
