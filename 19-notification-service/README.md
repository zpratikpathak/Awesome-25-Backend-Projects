# Notification Service Demo
<p align="center"><img src="logo.svg" alt="Notification queue message bell" width="160"></p>

Express with an in-memory simulated queue, **not BullMQ, RabbitMQ or real delivery**. `index.js` is supported; `worker.js` is an unused BullMQ stub, `src/index.js` a health-only placeholder.

## Docker
From repository root:
```sh
docker build -t backend-p19 ./19-notification-service
docker run --rm --network none backend-p19 npm test
docker run --rm -p 127.0.0.1:3019:3000 backend-p19
```
`PORT` defaults to 3000. No API keys, broker, Redis or host services.

## API and limits
- `GET /api/health`: health JSON.
- `POST /notify`: `{ "userId": "u1", "message": "Hello" }`; 202 returns UUID `jobId` and `status: "queued"`.
- `GET /status/:id`: job JSON; simulated timer changes `queued` to `sent` after two seconds. Unknown job: 404.
- Nonblank strings required: user ID ≤64 characters, message ≤2,000. Invalid input: 400; body ≤16 KiB.
- Capacity 1,000 retained jobs; full queue: 503. Restart clears jobs. No retries, durability, authentication or email/SMS/push delivery; `sent` means simulation completed.
- `smoke.js` checks HTTP validation, unique concurrent IDs, completion and unknown status.

Dependencies resolve during Docker build. Logo is original local SVG.
