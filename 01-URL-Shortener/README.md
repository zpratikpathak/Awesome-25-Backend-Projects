# URL Shortener

A URL shortener service that creates shortened URLs for long links with click tracking and analytics.

## Features
- URL shortening
- Click tracking
- Simple analytics
- API endpoints

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Redis (for caching)

## Project Structure
```
src/
├── controllers/
│   └── urlController.js
├── models/
│   └── Url.js
├── routes/
│   └── urlRoutes.js
├── services/
│   └── shortenService.js
├── utils/
│   └── generateShortCode.js
├── middleware/
│   └── rateLimiter.js
├── config/
│   └── db.js
└── app.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Redis (optional for caching)

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
```

### Running the application
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/shorten | Create a short URL |
| GET    | /:code | Redirect to original URL |
| GET    | /api/stats/:code | Get URL statistics |

## Implementation Details

The URL shortener works by:
1. Receiving a long URL via API
2. Generating a unique short code
3. Storing the mapping between short code and original URL
4. Providing a redirecting service when short URL is accessed
5. Tracking clicks and analytics