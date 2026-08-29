const express = require('express');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { realpath, stat } = require('node:fs/promises');

const run = promisify(execFile);
const app = express();
app.use(express.json({ limit: '4kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.post('/metadata', async (req, res) => {
  const { videoUrl } = req.body || {};
  // ponytail: mounted local media only; remote fetching needs a separate SSRF-safe ingestion boundary.
  if (typeof videoUrl !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/.test(videoUrl)) return res.status(400).json({ error: 'videoUrl must be a filename inside /media, not a URL or path' });
  try {
    const file = await realpath(`/media/${videoUrl}`);
    if (!file.startsWith('/media/') || !(await stat(file)).isFile()) return res.status(400).json({ error: 'Invalid media file' });
    const { stdout } = await run('ffprobe', ['-v', 'error', '-protocol_whitelist', 'file', '-print_format', 'json', '-show_format', '-show_streams', file], { timeout: 10000, maxBuffer: 1024 * 1024 });
    res.json(JSON.parse(stdout));
  } catch (error) {
    res.status(error.code === 'ENOENT' ? 404 : 422).json({ error: 'Media unavailable or invalid' });
  }
});

if (require.main === module) app.listen(process.env.PORT || 3000);
module.exports = app;
