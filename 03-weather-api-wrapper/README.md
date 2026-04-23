# Weather API Wrapper

## Description
A functional wrapper around the Open-Meteo public API, providing a simplified JSON response for current weather given latitude and longitude coordinates.

## Technologies Used
Go (Standard Library)

## Endpoints
- `GET /api/weather?lat={latitude}&lon={longitude}`
  Example: `/api/weather?lat=52.52&lon=13.41` (Berlin)

## Setup and Run Instructions
1. Run the application: `go run main.go`
2. Server listens on port 8080.
