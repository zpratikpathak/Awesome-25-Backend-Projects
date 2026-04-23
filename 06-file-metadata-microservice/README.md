# 06 - File Metadata Microservice

A simple Node.js microservice that accepts file uploads and returns their metadata (name, type, and size in bytes).

## Tech Stack
- Node.js
- Express
- Multer (for handling `multipart/form-data`)

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

### `POST /api/fileanalyse`
Upload a file using form-data with the field name `upfile`.

**Response:**
```json
{
  "name": "example.txt",
  "type": "text/plain",
  "size": 12345
}
```
