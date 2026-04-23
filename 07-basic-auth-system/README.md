# 07 Basic Auth System

A layered architecture authentication system with Node.js, JWT, and bcrypt.

## Architecture
- **src/routes**: Auth endpoints
- **src/controllers**: HTTP handling
- **src/services**: Password hashing and JWT generation
- **src/middleware**: Joi validation and error handling

## Setup
1. `npm install`
2. `cp .env.example .env`
3. `npm start`
