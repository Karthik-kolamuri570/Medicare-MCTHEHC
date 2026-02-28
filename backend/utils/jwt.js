const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

const getJwtSecret = () => process.env.JWT_SECRET || 'fallback_secret';

/**
 * Generate an access token
 * @param {{ id: string, role: 'patient'|'doctor'|'admin'|'bank' }} payload
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: ACCESS_TOKEN_EXPIRY });
};

/**
 * Generate a refresh token (longer-lived)
 * @param {{ id: string, role: 'patient'|'doctor'|'admin'|'bank' }} payload
 * @returns {string} JWT token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: REFRESH_TOKEN_EXPIRY });
};

/**
 * Verify a token and return the decoded payload
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token) => {
    return jwt.verify(token, getJwtSecret());
};

/**
 * Extract the Bearer token from an Authorization header
 * @param {import('express').Request} req
 * @returns {string|null}
 */
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }
    return null;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    extractToken,
};
