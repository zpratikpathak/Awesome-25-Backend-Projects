# Weather API Integration

A real-time weather data fetching and caching system that integrates with third-party weather APIs.

## Features
- Integration with OpenWeatherMap API
- Location-based weather data retrieval
- Caching system to minimize API calls
- Current weather conditions and forecasts
- Historical weather data access
- Metric and imperial unit conversion

## Tech Stack
- Node.js
- Express.js
- Redis (for caching)
- MongoDB (for storing user preferences and historical queries)
- Axios (for API requests)

## Project Structure
```
src/
├── controllers/
│   └── weatherController.js
├── models/
│   └── WeatherCache.js
├── routes/
│   └── weatherRoutes.js
├── services/
│   └── weatherService.js
├── utils/
│   ├── geoCoordinates.js
│   └── unitConverter.js
├── middleware/
│   ├── rateLimiter.js
│   └── errorHandler.js
├── config/
│   ├── db.js
│   └── redis.js
└── app.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Redis
- OpenWeatherMap API key

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/weather-api
REDIS_HOST=localhost
REDIS_PORT=6379
OPENWEATHERMAP_API_KEY=your_api_key_here
```

### Running the application
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/weather/current/:city | Get current weather for a city |
| GET    | /api/weather/forecast/:city | Get 5-day forecast for a city |
| GET    | /api/weather/historical/:city | Get historical weather data |
| GET    | /api/weather/coordinates | Get weather by latitude and longitude |

## Implementation Details

The Weather API Integration service provides:
1. Real-time weather data from OpenWeatherMap API
2. Smart caching system to reduce external API calls
3. Automatic unit conversion between metric and imperial systems
4. Comprehensive error handling for API failures
5. Rate limiting to prevent abuse