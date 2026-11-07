import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * Reads the JWT from the `x-access-token` header, an `Authorization: Bearer` header,
 * or (for older clients) the `token` body/query field.
 * @param {import('express').Request} req
 * @returns {string|undefined} the raw token
 */
const extractToken = (req) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return req.headers['x-access-token'] || req.body?.token || req.query?.token;
};

const authenticateToken = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(403).json({
      status: 'Failed',
      message: 'wrong token. provide  a valid token'
    });
  }
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Authentication failed. Token is either invalid or expired'
      });
    }
    req.decoded = decoded;
    next();
  });
};

export default authenticateToken;
