require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  jwt_secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwt_expiry: process.env.JWT_EXPIRY || '7d',
  node_env: process.env.NODE_ENV || 'development'
};
