<p align="center"><img src="logo.svg" width="120" alt="Original expense ledger logo"></p>

# 08 Expense Tracker API

Spring Boot / Java 17. In-memory expenses; no database or credentials.

## Docker startup and test
Run from this project folder; no host language tools required:

```sh
docker build -t backend-check-expenses .
docker run --rm -p 127.0.0.1:8080:8080 backend-check-expenses
docker run --rm --network none backend-check-expenses java smoke.java
```

Environment: `SERVER_PORT` defaults to `8080`; change the container-side mapping when overriding. `SPRING_PROFILES_ACTIVE` is optional; no custom profiles exist. Smoke requires default port. `.env` files are not loaded or copied.

## API
- `GET /api/expenses`: JSON array, 200.
- `POST /api/expenses`: `{"description":"Lunch","amount":12.50}`, 201 with generated UUID.
- Description: nonblank, at most 500 characters. Amount: greater than zero, at most 12 integer digits and 2 decimal places. Invalid bodies return 400; unsupported methods 405. Client IDs are overwritten.

Smoke starts the actual executable jar and checks HTTP create/list, malformed JSON, invalid amounts, generated IDs and method errors.

Limitations: no authentication, persistence, update/delete, pagination, or collection quota; restart clears data. Local learning API, not production deployment. Existing Spring Boot dependency version is retained; smoke is not a vulnerability audit.
