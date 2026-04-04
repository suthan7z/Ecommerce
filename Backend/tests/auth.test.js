const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');

jest.setTimeout(60000);

const authRoutes = require('../routes/auth');
const connectDB = require('../config/database');
const User = require('../models/User');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  await connectDB();

  app = express();
  app.use(bodyParser.json());
  app.use('/api/auth', authRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  test('register user and login', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const registerRes = await request(app).post('/api/auth/register').send(userData);
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.message).toBe('User registered successfully');

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe('test@example.com');
  });

  test('register invalid email fails', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});