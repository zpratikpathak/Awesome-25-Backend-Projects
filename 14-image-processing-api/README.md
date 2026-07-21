<p align="center"><img src="logo.svg" width="120" alt="Original image preview logo"></p>

# 14 Image Processing API — Metadata Preview

FastAPI validates image-operation metadata. It does not fetch URLs or process image bytes; response says `preview`, not `processed`.

## Docker startup and test
Run from this project folder:

```sh
docker build -t backend-check-images .
docker run --rm -p 127.0.0.1:8000:8000 backend-check-images
docker run --rm --network none backend-check-images python smoke.py
```

No environment variables, credentials or database. Port 8000. `.env*` excluded from image.

## API
- `POST /api/images/process`: `{"url":"https://example.com/a.png","filter_type":"grayscale"}`.
- URL must be HTTP/HTTPS. Filter: `grayscale`, `blur` or `sepia`. Returns 200 with URL string, filter and `status: "preview"`. Invalid schema/JSON returns 422.
- `GET /docs`: OpenAPI UI; `GET /openapi.json`: schema.

Smoke starts actual uvicorn process and checks HTTP responses, URL/filter validation, malformed JSON and URL serialization. Network disabled; example URL is metadata only.

Limitations: no image download, transformation, storage, authentication or explicit request-size limit. Before adding URL fetching, implement SSRF controls, redirect/DNS checks, timeouts, byte/pixel limits and safe decoding. Existing dependency versions retained; not a production vulnerability audit.
