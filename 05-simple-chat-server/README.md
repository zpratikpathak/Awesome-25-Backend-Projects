# 05 - Simple Chat Server

A real-time chat server built with Node.js, Express, and Socket.io.

## Features
- **Architecture:** Layered pattern separating Express logic from Socket.io logic.
- **Validation:** strict incoming message validation using Zod.
- **Logging:** Structured logging using Winston.
- **Error Handling:** Centralized Express and Socket error handling.
- **Environment Support:** Configurable using `.env`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Config:
   Copy `.env.example` to `.env`.

3. Run the Server:
   ```bash
   npm run start
   # Or for dev mode:
   npm run dev
   ```

## API
- `GET /api/health` - Check API health status.
- WebSocket events: `join`, `message`, `history`, `user_joined`, `user_left`.
