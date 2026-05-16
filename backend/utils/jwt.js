const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// Access token secret — required
const getAccessSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    return process.env.JWT_SECRET;
};

// Refresh token secret — separate from access; falls back gracefully
const getRefreshSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    // Use dedicated refresh secret if available, otherwise derive one
    return process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET + '_refresh_v1');
};

/**
 * Generate an access token (short-lived, 24h)
 * @param {{ id: string, role: 'patient'|'doctor'|'admin'|'bank' }} payload
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, getAccessSecret(), { expiresIn: ACCESS_TOKEN_EXPIRY });
};

/**
 * Generate a refresh token (long-lived, 7d) — uses a DIFFERENT secret
 * @param {{ id: string, role: 'patient'|'doctor'|'admin'|'bank' }} payload
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, getRefreshSecret(), { expiresIn: REFRESH_TOKEN_EXPIRY });
};

/**
 * Verify an ACCESS token
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token) => {
    return jwt.verify(token, getAccessSecret());
};

/**
 * Verify a REFRESH token (uses separate secret)
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, getRefreshSecret());
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
    verifyRefreshToken,
    extractToken,
};
