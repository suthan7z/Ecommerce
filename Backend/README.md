# Ecommerce Backend

A Node.js/Express backend for a small ecommerce store with complete authentication, product management, shopping cart, and order system.

## Features

- **User Authentication**: Register, login, JWT-based authentication
- **Product Management**: Browse products, add reviews, filter by category and price
- **Shopping Cart**: Add/remove items, update quantities
- **Order System**: Create orders, track status, cancel orders
- **Admin Panel**: Manage products, view all orders, update order status
- **Role-Based Access**: User vs Admin privileges

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
PORT=5000
```

## Running the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Testing

Run unit/integration tests:
```bash
npm test
```

## Validation & Security Improvements

- Added Joi-based validation for auth, products, cart, orders, payments.
- Added sanitization / strict schema enforcement.
- Switched to secure error responses in production (generic messages), with detailed errors only in development.

## Notes
- `NODE_ENV=development` includes stack traces in API responses for debugging.
- `NODE_ENV=production` hides error details from clients.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/reviews` - Add review (protected)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart (protected)
- `POST /api/cart/add` - Add to cart (protected)
- `PUT /api/cart/update` - Update cart item (protected)
- `POST /api/cart/remove` - Remove from cart (protected)
- `POST /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `POST /api/orders/:id/cancel` - Cancel order (protected)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/orders/admin/all` - Get all orders (admin)

## Example Requests

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product (Admin)
```json
POST /api/products
Authorization: Bearer {token}
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 1200,
  "category": "Electronics",
  "stock": 10,
  "image": "image_url"
}
```

### Add to Cart
```json
POST /api/cart/add
Authorization: Bearer {token}
{
  "productId": "product_id",
  "quantity": 1
}
```

### Create Order
```json
POST /api/orders
Authorization: Bearer {token}
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "paymentMethod": "card"
}
```

## File Structure

```
├── server.js                 # Entry point
├── package.json             # Dependencies
├── .env.example            # Environment variables template
├── config/
│   ├── database.js         # MongoDB connection
│   └── env.js              # Configuration
├── models/
│   ├── User.js             # User schema
│   ├── Product.js          # Product schema
│   ├── Cart.js             # Cart schema
│   └── Order.js            # Order schema
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product logic
│   ├── cartController.js   # Cart logic
│   └── orderController.js  # Order logic
├── routes/
│   ├── auth.js             # Auth routes
│   ├── products.js         # Product routes
│   ├── cart.js             # Cart routes
│   └── orders.js           # Order routes
└── middleware/
    └── auth.js             # Authentication middleware
```

## Security Considerations

- Always use environment variables for sensitive data
- Hash passwords with bcrypt
- Use JWT for stateless authentication
- Validate and sanitize user inputs
- Use HTTPS in production
- Implement rate limiting
- Add CORS restrictions

## Future Enhancements

- Payment gateway integration
- Email notifications
- Image upload functionality
- Inventory management
- Discount codes
- Product recommendations
- Search functionality
- Analytics dashboard
