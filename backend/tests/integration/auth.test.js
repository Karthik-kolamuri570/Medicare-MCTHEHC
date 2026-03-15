const request = require('supertest');
const express = require('express');
const Patient = require('../../models/patient');
const { generateAccessToken } = require('../../utils/jwt');
const bcrypt = require('bcryptjs');

// Mock app for testing
const app = express();
app.use(express.json());

// Mock routes
const patientRoutes = require('../../routes/patientRoutes');
app.use('/api/patient', patientRoutes);

describe('Patient Authentication Integration Tests', () => {
  let testPatient;
  let testToken;

  beforeEach(async () => {
    // Clear database
    await Patient.deleteMany({});

    // Create test patient
    const hashedPassword = await bcrypt.hash('testPassword123', 10);
    testPatient = await Patient.create({
      name: 'Test Patient',
      email: 'test@example.com',
      password: hashedPassword,
      contact: 9876543210,
      age: 30,
      gender: 'male',
      address: 'Test Address'
    });

    // Generate token
    testToken = generateAccessToken({ id: testPatient._id, role: 'patient' });
  });

  describe('POST /api/patient/register', () => {
    it('should register a new patient successfully', async () => {
      const response = await request(app)
        .post('/api/patient/register')
        .send({
          name: 'New Patient',
          email: 'newpatient@example.com',
          password: 'Password123',
          contact: 9876543211,
          age: 25,
          gender: 'female',
          address: 'New Address'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('newpatient@example.com');
    });

    it('should not register patient with existing email', async () => {
      const response = await request(app)
        .post('/api/patient/register')
        .send({
          name: 'Duplicate Patient',
          email: 'test@example.com',
          password: 'Password123',
          contact: 9876543211,
          age: 25,
          gender: 'female',
          address: 'Address'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/patient/register')
        .send({
          name: 'Test',
          email: 'test@example.com'
          // Missing other required fields
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /api/patient/login', () => {
    it('should login patient with correct credentials', async () => {
      const response = await request(app)
        .post('/api/patient/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/patient/login')
        .send({
          email: 'test@example.com',
          password: 'wrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/patient/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/patient/forgot-password', () => {
    it('should send password reset email for valid email', async () => {
      const response = await request(app)
        .post('/api/patient/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should not reveal if email exists', async () => {
      const response = await request(app)
        .post('/api/patient/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/patient/me', () => {
    it('should return patient profile with valid token', async () => {
      const response = await request(app)
        .get('/api/patient/me')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/patient/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/patient/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
