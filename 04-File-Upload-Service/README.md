# File Upload Service

A secure file storage system with format validation, size limits, and comprehensive management capabilities.

## Features
- Secure file uploads with validation
- Multi-format file support
- File metadata storage
- Access control and permissions
- Image processing and optimization
- Direct file downloads
- Temporary file links generation
- File versioning

## Tech Stack
- Node.js
- Express.js
- MongoDB (for metadata)
- Multer (for file uploads)
- Sharp (for image processing)
- AWS S3 / Local Storage

## Project Structure
```
src/
├── controllers/
│   └── fileController.js
├── models/
│   ├── File.js
│   └── User.js
├── routes/
│   └── fileRoutes.js
├── services/
│   ├── storageService.js
│   └── imageService.js
├── utils/
│   ├── fileValidator.js
│   └── fileNamer.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── config/
│   ├── db.js
│   └── storage.js
└── app.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- AWS S3 bucket (optional for cloud storage)

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/file-upload-service
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/plain
STORAGE_TYPE=local # or s3
UPLOAD_DIR=./uploads

# For S3 storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
S3_BUCKET=your_bucket_name
```

### Running the application
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/files/upload | Upload a new file |
| GET    | /api/files | Get all files (with pagination) |
| GET    | /api/files/:id | Get file details |
| GET    | /api/files/:id/download | Download a file |
| DELETE | /api/files/:id | Delete a file |
| PUT    | /api/files/:id/metadata | Update file metadata |
| POST   | /api/files/:id/share | Generate a shareable link |

## Implementation Details

The File Upload Service handles:
1. Secure file validation to prevent malicious uploads
2. Efficient storage management with multiple backend options
3. Comprehensive metadata tracking
4. User permissions and access control
5. On-the-fly image optimization for uploaded images
6. Temporary shareable link generation