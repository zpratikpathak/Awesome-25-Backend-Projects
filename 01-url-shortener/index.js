const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('URL Shortener'));
app.listen(3000);
