const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user.model');

dotenv.config();


const authMiddleware = async (req, res, next) => {

    try {
        const authHeader = req.header('Authorization');

        // authHeader present or not
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied'
            })
        }

        // Token
        const token = authHeader.split(' ')[1];

        // Decode the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);


        req.user = decode;

        next()

    } catch (error) {
        return res.status(403).json({  // 403 Forbidden for invalid token
            success: false,
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
}

module.exports = authMiddleware;