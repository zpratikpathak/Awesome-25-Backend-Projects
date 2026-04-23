# 10 - Task Scheduler

A Node.js background task scheduler utilizing `node-cron` to perform scheduled background jobs alongside an Express web server.

## Tech Stack
- Node.js
- Express
- Node-Cron

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the server:
   ```bash
   npm start
   ```

## Scheduled Tasks
- **Every minute (`* * * * *`)**: Appends the current timestamp to a local `task.log` file and logs to the console.
- **Every 5 minutes (`*/5 * * * *`)**: Runs a mock routine representing database cleanup.

## Endpoints

### `GET /`
Returns a simple status message.

### `GET /logs`
Returns the content of the `task.log` file showing the execution history of the every-minute job.