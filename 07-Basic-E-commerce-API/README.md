# Basic E-commerce API

A comprehensive RESTful API for a basic e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- **User Management**
  - Registration and login with JWT authentication
  - User profiles with order history
  - Role-based access control (admin, customer)

- **Product Management**
  - CRUD operations for products
  - Product categorization
  - Product search, filtering, and sorting
  - Product reviews and ratings
  - Product image upload

- **Category Management**
  - Hierarchical categories
  - Category-based product filtering

- **Cart Management**
  - Add/remove products from cart
  - Update product quantities
  - Calculate total prices

- **Order Management**
  - Create orders from cart
  - Order status tracking
  - Order history
  - Payment integration with Stripe

- **Wishlist Management**
  - Add/remove products from wishlist
  - Move products from wishlist to cart

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products/:id/reviews` - Add review to product
- `GET /api/products/:id/reviews` - Get product reviews

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add product to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order from cart
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `POST /api/orders/:id/payment` - Process payment for order

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add product to wishlist
- `DELETE /api/wishlist/:productId` - Remove product from wishlist
- `POST /api/wishlist/:productId/cart` - Move product from wishlist to cart

## Project Structure

```
src/
  ├── config/        # Configuration files and environment variables
  ├── controllers/   # Route handlers
  ├── middleware/    # Custom middleware (auth, validation, etc.)
  ├── models/        # Database models
  ├── routes/        # API routes
  ├── services/      # Business logic services
  ├── utils/         # Utility functions
  └── app.js         # Express app setup
```

## Technologies Used

- Node.js and Express for the API server
- MongoDB and Mongoose for database
- JWT for authentication
- Express Validator for request validation
- Stripe for payment processing
- Multer for file uploads

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up environment variables in a `.env` file
4. Run `npm run dev` to start the development server