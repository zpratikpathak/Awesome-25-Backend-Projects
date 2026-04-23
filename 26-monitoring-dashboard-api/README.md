# 26-monitoring-dashboard-api

## Description
A backend API project.

## Technologies Used
Node.js

## Prerequisites
- Node.js (v14+ recommended)
- npm

## Setup Instructions
```bash
npm install
```

## Run Instructions
```bash
npm start
```

## Example API Endpoints / Usage
Hit some endpoints to generate metrics:
```sh
curl http://localhost:8080/api/hello
curl http://localhost:8080/api/slow
curl http://localhost:8080/api/error
```

View the generated metrics (ready for Prometheus to scrape):
```sh
curl http://localhost:8080/metrics
```
