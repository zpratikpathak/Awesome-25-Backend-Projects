# Image Processing API

A FastAPI service to resize images using Pillow.

## Endpoints
- \`POST /resize?width=200&height=200\` (multipart/form-data with \`file\`)

## Setup
\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`
