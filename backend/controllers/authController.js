const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', 
    });
};

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // 1. Check if the email is already taken
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // 2. Create the user (Password is hashed automatically by our Mongoose hook!)
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || 'Stagiaire' 
        });

        // 3. Send back the user data + the JWT
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user. We MUST use .select('+password') because we hid it in the model!
        const user = await User.findOne({ email }).select('+password');

        // 2. Check if user exists AND password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    // req.user is already available here thanks to our 'protect' middleware
    res.status(200).json({
        success: true,
        data: req.user
    });
};

// @desc    Admin dashboard stats (Test route)
// @route   GET /api/auth/admin-data
exports.getAdminData = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bienvenue Admin! Voici les données secrètes.'
    });
};