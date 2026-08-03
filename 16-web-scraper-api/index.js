const express = require('express');
const cheerio = require('cheerio');
const https = require('node:https');

const app = express();
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.post('/scrape', async (req, res) => {
  const { url, selector = 'title' } = req.body || {};
  let target;
  try { target = new URL(url); } catch { return res.status(400).json({ error: 'Invalid URL' }); }
  // ponytail: example.com-only demo prevents arbitrary network access; expand with DNS-pinned public-address validation.
  if (typeof url !== 'string' || url.length > 2048 || target.origin !== 'https://example.com' || target.username || target.password || typeof selector !== 'string' || !selector.trim() || selector.length > 200) {
    return res.status(400).json({ error: 'Use https://example.com and a selector of 1–200 characters' });
  }
  try {
    const html = await new Promise((resolve, reject) => {
      const request = https.get(target, { timeout: 5000 }, response => {
        if (response.statusCode !== 200) { response.resume(); reject(new Error('Upstream status')); return; }
        let body = '';
        let size = 0;
        response.on('data', chunk => {
          size += chunk.length;
          if (size > 1024 * 1024) { response.destroy(new Error('Response too large')); return; }
          body += chunk.toString();
        });
        response.on('end', () => resolve(body));
        response.on('error', reject);
      });
      request.on('timeout', () => request.destroy(new Error('Timeout')));
      request.on('error', reject);
    });
    const $ = cheerio.load(html);
    let matches;
    try { matches = $(selector); } catch { return res.status(400).json({ error: 'Invalid selector' }); }
    res.json({ result: matches.slice(0, 100).map((i, el) => $(el).text().trim().slice(0, 10000)).get() });
  } catch { res.status(502).json({ error: 'Upstream unavailable' }); }
});

if (require.main === module) app.listen(process.env.PORT || 3000);
module.exports = app;
