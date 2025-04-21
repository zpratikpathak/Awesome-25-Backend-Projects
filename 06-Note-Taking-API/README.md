# Note Taking API

A feature-rich API for managing personal notes with categories, tags, and search functionality.

## Features
- User authentication and authorization
- Create, read, update, and delete notes
- Organize notes with categories
- Tag-based classification
- Full-text search capabilities
- Note sharing options
- Markdown support
- Archive and trash functionality
- Reminders and notifications

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Mongoose for data modeling
- Express Validator for validation

## Project Structure
```
src/
├── controllers/
│   ├── noteController.js
│   ├── categoryController.js
│   └── userController.js
├── models/
│   ├── Note.js
│   ├── Category.js
│   └── User.js
├── routes/
│   ├── noteRoutes.js
│   ├── categoryRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js
│   └── validate.js
├── utils/
│   ├── errorHandler.js
│   └── searchHelpers.js
├── config/
│   └── db.js
└── app.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/note-taking-api
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### Running the application
```bash
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/users/register | Register a new user |
| POST   | /api/users/login | User login |
| GET    | /api/users/me | Get user profile |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/notes | Get all notes |
| GET    | /api/notes/:id | Get a specific note |
| POST   | /api/notes | Create a new note |
| PUT    | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |
| GET    | /api/notes/search | Search notes |
| PUT    | /api/notes/:id/archive | Archive a note |
| PUT    | /api/notes/:id/restore | Restore an archived note |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/categories | Get all categories |
| GET    | /api/categories/:id | Get a specific category |
| POST   | /api/categories | Create a new category |
| PUT    | /api/categories/:id | Update a category |
| DELETE | /api/categories/:id | Delete a category |
| GET    | /api/categories/:id/notes | Get all notes in a category |

## Implementation Details

The Note Taking API provides:
1. Secure user authentication using JWT
2. Comprehensive note management with CRUD operations
3. Hierarchical categorization for better organization
4. Powerful search capabilities
5. Archiving and recovery features
6. Support for rich text formatting with Markdown