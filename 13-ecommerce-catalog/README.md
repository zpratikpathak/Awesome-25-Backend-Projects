<p align="center"><img src="logo.svg" width="120" alt="Original catalog box logo"></p>

# 13 E-commerce Catalog

Minimal Express read-only static catalog. No database or credentials.

## Docker startup and test
Run from this project folder:

```sh
docker build -t backend-check-catalog .
docker run --rm -p 127.0.0.1:3000:3000 backend-check-catalog
docker run --rm --network none backend-check-catalog npm test
```

Environment: `PORT` defaults to 3000; change mapping when overridden. No `.env` loader; use Docker `-e`. `.env*` excluded from image.

## API
`GET /api/catalog` returns `[{"id":1,"name":"Item"}]`, 200. No query parameters or write operations. Unknown routes/methods return 404. Malformed JSON body returns 400; oversized JSON returns 413. Unexpected errors return generic 500.

Smoke starts a real local HTTP listener, verifies catalog contents, unknown routes/methods and malformed body handling.

Limitations: static fixture only; no products database, prices, search, pagination, checkout or authentication.