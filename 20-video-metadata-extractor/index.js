import express from 'express';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
app.use(express.json());

app.post('/metadata', async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) return res.status(400).json({ error: 'videoUrl required' });
  
  try {
    // Basic mock extracting metadata using ffprobe if available
    const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${videoUrl}"`;
    const { stdout } = await execPromise(command);
    res.json(JSON.parse(stdout));
  } catch (error) {
    // Fallback if ffprobe is not installed locally
    res.json({
      mockMetadata: true,
      url: videoUrl,
      duration: "120s",
      resolution: "1920x1080",
      note: "ffprobe command failed or not installed. Showing mock data."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
