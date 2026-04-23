# Video Metadata Extractor

A Node.js API that attempts to extract video metadata using \`ffprobe\` via child_process.

## Endpoints
- \`POST /metadata\` - Extract metadata (Body: \`{ "videoUrl": "path_or_url" }\`)

## Setup
\`\`\`bash
# Requires ffmpeg/ffprobe installed on the system
npm install
npm start
\`\`\`
