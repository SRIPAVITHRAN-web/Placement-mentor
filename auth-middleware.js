// Authentication Middleware for AI Placement Mentor

import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Verify JWT Token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Hash Password
export const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
};

// Compare Password
export const comparePassword = async (password, hashedPassword) => {
    return bcryptjs.compare(password, hashedPassword);
};

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Rate Limiting Middleware
export const rateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();
    
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        
        if (!attempts.has(key)) {
            attempts.set(key, []);
        }
        
        const userAttempts = attempts.get(key);
        const recentAttempts = userAttempts.filter(time => now - time < windowMs);
        
        if (recentAttempts.length >= maxAttempts) {
            return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
        }
        
        recentAttempts.push(now);
        attempts.set(key, recentAttempts);
        next();
    };
};

// Input Validation Middleware
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

export const validateUsername = (username) => {
    // 3-30 characters, alphanumeric and underscore only
    const re = /^[a-zA-Z0-9_]{3,30}$/;
    return re.test(username);
};

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
};

// Async Handler Wrapper
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
