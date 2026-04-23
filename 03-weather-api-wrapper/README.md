# 03-weather-api-wrapper

## Description
A functional wrapper around the Open-Meteo public API, providing a simplified JSON response for current weather given latitude and longitude coordinates.

## Technologies Used
Go (Standard Library)

## Prerequisites
- Go (1.16+ recommended)

## Setup Instructions
```bash
go mod tidy
```

## Run Instructions
```bash
go run main.go
```

## Example API Endpoints / Usage
- `GET /api/weather?lat={latitude}&lon={longitude}`
  Example: `/api/weather?lat=52.52&lon=13.41` (Berlin)
