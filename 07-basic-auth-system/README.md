# 07 - Basic Auth System

A fully functional authentication API using Node.js, Express, JWT, and Bcrypt with an in-memory database.

## Tech Stack
- Node.js
- Express
- Bcrypt (for password hashing)
- JsonWebToken (JWT for stateless authentication)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the server:
   ```bash
   npm start
   ```

## Endpoints

### `POST /api/auth/register`
Register a new user.
**Body:** `{ "username": "admin", "password": "password123" }`

### `POST /api/auth/login`
Log in and receive a JWT.
**Body:** `{ "username": "admin", "password": "password123" }`

### `GET /api/auth/profile`
A protected route that requires a valid JWT.
**Headers:** `Authorization: Bearer <your_token>`
