const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, invalid token'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
};

const isOwnerOrAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    
    if (req.user && req.user.id === req.params.id) {
        return next();
    }
    
    res.status(403).json({
        success: false,
        message: 'You can only access your own account'
    });
};

module.exports = { protect, admin, isOwnerOrAdmin };