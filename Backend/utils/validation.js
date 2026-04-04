const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be less than 50 characters'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(50)
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be less than 50 characters'
      }),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim(),
      zipCode: Joi.string().trim()
    })
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 2 characters',
        'string.max': 'Product name must be less than 100 characters'
      }),
    description: Joi.string().trim().min(10).max(1000).required()
      .messages({
        'string.empty': 'Product description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description must be less than 1000 characters'
      }),
    price: Joi.number().positive().required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required'
      }),
    category: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.empty': 'Category is required',
        'string.min': 'Category must be at least 2 characters',
        'string.max': 'Category must be less than 50 characters'
      }),
    stock: Joi.number().integer().min(0).default(0)
      .messages({
        'number.min': 'Stock cannot be negative'
      }),
    image: Joi.string().uri()
      .messages({
        'string.uri': 'Image must be a valid URL'
      })
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.min': 'Product name must be at least 2 characters',
        'string.max': 'Product name must be less than 100 characters'
      }),
    description: Joi.string().trim().min(10).max(1000)
      .messages({
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description must be less than 1000 characters'
      }),
    price: Joi.number().positive()
      .messages({
        'number.positive': 'Price must be a positive number'
      }),
    category: Joi.string().trim().min(2).max(50)
      .messages({
        'string.min': 'Category must be at least 2 characters',
        'string.max': 'Category must be less than 50 characters'
      }),
    stock: Joi.number().integer().min(0)
      .messages({
        'number.min': 'Stock cannot be negative'
      }),
    image: Joi.string().uri()
      .messages({
        'string.uri': 'Image must be a valid URL'
      })
  }),

  addReview: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required()
      .messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating must be at most 5',
        'any.required': 'Rating is required'
      }),
    comment: Joi.string().trim().min(1).max(500).required()
      .messages({
        'string.empty': 'Comment cannot be empty',
        'string.min': 'Comment must be at least 1 character',
        'string.max': 'Comment must be less than 500 characters'
      })
  })
};

// Cart validation schemas
const cartSchemas = {
  addToCart: Joi.object({
    productId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Invalid product ID format',
        'string.length': 'Invalid product ID',
        'any.required': 'Product ID is required'
      }),
    quantity: Joi.number().integer().min(1).required()
      .messages({
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required'
      })
  }),

  updateCart: Joi.object({
    productId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Invalid product ID format',
        'string.length': 'Invalid product ID',
        'any.required': 'Product ID is required'
      }),
    quantity: Joi.number().integer().min(0).required()
      .messages({
        'number.min': 'Quantity cannot be negative',
        'any.required': 'Quantity is required'
      })
  }),

  removeFromCart: Joi.object({
    productId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Invalid product ID format',
        'string.length': 'Invalid product ID',
        'any.required': 'Product ID is required'
      })
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    shippingAddress: Joi.object({
      street: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      zipCode: Joi.string().trim().required()
    }).required()
      .messages({
        'any.required': 'Shipping address is required'
      }),
    paymentMethod: Joi.string().valid('card', 'cash').default('card')
      .messages({
        'any.only': 'Payment method must be card or cash'
      })
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').required()
      .messages({
        'any.only': 'Invalid order status',
        'any.required': 'Status is required'
      })
  })
};

// Payment validation schemas
const paymentSchemas = {
  initiate: Joi.object({
    orderId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Invalid order ID format',
        'string.length': 'Invalid order ID',
        'any.required': 'Order ID is required'
      })
  }),

  refund: Joi.object({
    orderId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Invalid order ID format',
        'string.length': 'Invalid order ID',
        'any.required': 'Order ID is required'
      })
  })
};

module.exports = {
  userSchemas,
  productSchemas,
  cartSchemas,
  orderSchemas,
  paymentSchemas
};