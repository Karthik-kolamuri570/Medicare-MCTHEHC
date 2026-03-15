const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, verifyToken, extractToken } = require('../../utils/jwt');

describe('JWT Utilities', () => {
  const testPayload = { id: '123456', role: 'patient' };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should create a token with correct payload', () => {
      const token = generateAccessToken(testPayload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error if JWT_SECRET is not set', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      expect(() => {
        generateAccessToken(testPayload);
      }).toThrow('JWT_SECRET is not set');
      
      process.env.JWT_SECRET = originalSecret;
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should create a token with correct payload', () => {
      const token = generateRefreshToken(testPayload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.role).toBe(testPayload.role);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      const expiredToken = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '-1h' });
      expect(() => {
        verifyToken(expiredToken);
      }).toThrow();
    });
  });

  describe('extractToken', () => {
    it('should extract token from Bearer header', () => {
      const token = 'test-token-123';
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      
      const extracted = extractToken(req);
      expect(extracted).toBe(token);
    });

    it('should return null if no authorization header', () => {
      const req = { headers: {} };
      const extracted = extractToken(req);
      expect(extracted).toBeNull();
    });

    it('should return null if header does not start with Bearer', () => {
      const req = {
        headers: {
          authorization: 'Basic dGVzdDp0ZXN0'
        }
      };
      
      const extracted = extractToken(req);
      expect(extracted).toBeNull();
    });
  });
});
