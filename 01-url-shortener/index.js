const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const urlDatabase = {};

app.post('/api/shorten', (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }
    try {
        new URL(originalUrl);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    const shortId = crypto.randomBytes(3).toString('hex');
    urlDatabase[shortId] = originalUrl;

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
    res.json({ originalUrl, shortUrl, shortId });
});

app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;
    const originalUrl = urlDatabase[shortId];
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

app.listen(PORT, () => console.log(`URL Shortener listening on port ${PORT}`));
