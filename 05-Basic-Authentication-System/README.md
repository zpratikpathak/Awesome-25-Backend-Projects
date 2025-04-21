# Basic Authentication System

A complete user authentication and authorization system with secure login, registration, and session management.

## Features
- User registration with email verification
- Secure login with JWT authentication
- Password hashing using bcrypt
- Password reset functionality
- Account management (update profile, change password)
- Role-based authorization
- Session management
- OAuth integration (Google, GitHub)
- Two-factor authentication option
- Account lockout after failed attempts

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email sending

## Project Structure
```
src/
├── controllers/
│   ├── authController.js
│   └── userController.js
├── models/
│   ├── User.js
│   └── Token.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js
│   ├── roleCheck.js
│   └── rateLimiter.js
├── utils/
│   ├── emailTemplates.js
│   ├── tokenGenerator.js
│   └── validators.js
├── config/
│   ├── db.js
│   └── email.js
└── app.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- SMTP server for email functionality

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth-system
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
REFRESH_TOKEN_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=no-reply@example.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
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
| POST   | /api/auth/verify-email | Verify email address |
| POST   | /api/auth/login | User login |
| POST   | /api/auth/refresh-token | Refresh access token |
| POST   | /api/auth/forgot-password | Request password reset |
| POST   | /api/auth/reset-password | Reset password with token |
| POST   | /api/auth/logout | Logout (invalidate token) |
| POST   | /api/auth/google | Google OAuth login |
| POST   | /api/auth/github | GitHub OAuth login |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/users/me | Get current user profile |
| PUT    | /api/users/me | Update user profile |
| PUT    | /api/users/password | Change password |
| POST   | /api/users/2fa/enable | Enable two-factor auth |
| POST   | /api/users/2fa/verify | Verify two-factor code |
| POST   | /api/users/2fa/disable | Disable two-factor auth |

## Implementation Details

The authentication system provides:
1. Secure user authentication with JWT and refresh tokens
2. Role-based access control for protected resources
3. Email verification for new account registration
4. Password reset functionality via email
5. Protection against brute-force attacks with rate limiting
6. OAuth integration for social login options
7. Two-factor authentication for enhanced security