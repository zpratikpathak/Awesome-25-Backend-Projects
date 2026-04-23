# 01-url-shortener

## Description
A fully functional REST API to shorten long URLs and perform redirection.

## Technologies Used
Node.js, Express, Crypto

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
- `POST /api/shorten` - Pass JSON body `{"originalUrl": "https://..."}` to receive a shortened URL.
- `GET /:shortId` - Redirects to the original URL.
