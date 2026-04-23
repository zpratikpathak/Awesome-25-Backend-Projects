# URL Shortener

## Description
A fully functional REST API to shorten long URLs and perform redirection.

## Technologies Used
Node.js, Express, Crypto

## Endpoints
- `POST /api/shorten` - Pass JSON body `{"originalUrl": "https://..."}` to receive a shortened URL.
- `GET /:shortId` - Redirects to the original URL.

## Setup and Run Instructions
1. Install dependencies: `npm install`
2. Start server: `npm start`
