const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = require('../jwtSecret');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided'
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}

module.exports = authMiddleware;