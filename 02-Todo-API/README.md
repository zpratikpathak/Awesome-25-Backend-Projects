# Todo API

A RESTful API for managing tasks with user authentication and data persistence.

## Features
- User authentication and authorization
- CRUD operations for tasks
- Task categories and priorities
- Search and filtering capabilities
- Pagination of results

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Jest for testing

## Project Structure
```
src/
├── controllers/
│   ├── authController.js
│   └── todoController.js
├── models/
│   ├── User.js
│   └── Todo.js
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── config/
│   └── db.js
├── utils/
│   └── validators.js
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
MONGO_URI=mongodb://localhost:27017/todo-api
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
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login | User login |
| GET    | /api/auth/me | Get current user profile |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/todos | Get all todos for current user |
| GET    | /api/todos/:id | Get a specific todo |
| POST   | /api/todos | Create a new todo |
| PUT    | /api/todos/:id | Update a todo |
| DELETE | /api/todos/:id | Delete a todo |
| GET    | /api/todos/categories/:category | Get todos by category |

## Implementation Details

The Todo API provides a complete task management system with:
1. User registration and authentication using JWT
2. CRUD operations for tasks with validation
3. Task categorization and prioritization
4. Filtering and searching capabilities
5. Comprehensive error handling