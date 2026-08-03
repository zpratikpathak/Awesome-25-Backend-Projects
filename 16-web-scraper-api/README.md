# Web Scraper API
<p align="center"><img src="logo.svg" alt="Web scraper page and extraction lens" width="160"></p>

Express + Cheerio demo. `index.js` is the supported entrypoint; `src/index.js` is an older health-only placeholder.

## Docker
From repository root:
```sh
docker build -t backend-p16 ./16-web-scraper-api
docker run --rm --network none backend-p16 npm test
docker run --rm -p 127.0.0.1:3016:3000 backend-p16
```
`PORT` defaults to 3000. No keys or external services required.

## API and limits
- `GET /api/health`: `{ "status": "ok" }`.
- `POST /scrape`: JSON `{ "url": "https://example.com", "selector": "title" }`; returns `{ "result": ["Example Domain"] }` when upstream succeeds. Selector defaults to `title`.
- Only HTTPS origin `example.com` accepted; credentials, arbitrary hosts and redirects rejected. Request body 16 KiB; upstream 1 MiB, 5 seconds; at most 100 results, 10,000 characters each.
- Invalid input/selector: 400. Upstream failure or non-200 response: 502. No JavaScript rendering, crawling, authentication or general-purpose URL fetching.
- `smoke.js` mocks HTTPS locally: no external calls, checks extraction, disallowed targets, invalid selector and redirect rejection.

Dependency versions resolve during image build; no lockfile reproducibility guarantee. Logo is original local SVG.
