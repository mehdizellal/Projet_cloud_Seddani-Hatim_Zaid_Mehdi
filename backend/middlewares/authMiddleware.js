const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes (Check if user is logged in)
exports.protect = async (req, res, next) => {
    let token;

    // Check if the token is sent in the headers as "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé, pas de token fourni' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID from the token payload and attach it to the request (req.user)
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        next(); // The bouncer steps aside, let the user through to the controller!
    } catch (error) {
        return res.status(401).json({ message: 'Non autorisé, token invalide ou expiré' });
    }
};

// 2. Role-Based Access Control (RBAC)
// Usage: authorize('Admin', 'Formateur')
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // req.user is set by the 'protect' middleware above
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Le rôle '${req.user.role}' n'est pas autorisé à accéder à cette ressource` 
            });
        }
        next();
    };
};