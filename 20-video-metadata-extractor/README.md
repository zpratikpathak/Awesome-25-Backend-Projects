# Media Metadata Extractor
<p align="center"><img src="logo.svg" alt="Media metadata film frame and data" width="160"></p>

Express invokes installed `ffprobe` with argument arrays, not a shell. `index.js` is supported; `src/index.js` is an older health-only placeholder. No fabricated success fallback.

## Docker
From repository root:
```sh
docker build -t backend-p20 ./20-video-metadata-extractor
docker run --rm --network none backend-p20 npm test
docker run --rm -p 127.0.0.1:3020:3000 --mount type=bind,source=/absolute/path/to/media,target=/media,readonly backend-p20
```
Replace source with an existing absolute media directory (Windows example: `D:/Media`). `PORT` defaults to 3000. ffmpeg/ffprobe install inside image only.

## API and limits
- `GET /api/health`: health JSON.
- `POST /metadata`: `{ "videoUrl": "clip.mp4" }`; returns ffprobe `format` and `streams` JSON. Historical field name retained, but **only a filename inside `/media` is accepted**, not a remote URL.
- Filename: 1–128 ASCII letters/digits/dot/underscore/hyphen, starts alphanumeric. Traversal and symlink escape rejected. ffprobe allows file protocol only; no HTTP fetching. Request ≤4 KiB, subprocess ≤10 seconds, output ≤1 MiB.
- Invalid input: 400; missing file: 404; unprobeable media: 422. No uploads, conversion, authentication or remote extraction.
- `smoke.js` generates a tiny WAV inside disposable container, runs real ffprobe, checks URL/path/shell/symlink rejection. WAV is a regression fixture, not a video-only claim.

Mount only trusted media; native media parsing remains an attack surface. Dependencies resolve during Docker build. Logo is original local SVG.
