const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez utiliser un email valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: 8,
        select: false // Automatically hide password from API responses for security
    },
    role: {
        type: String,
        enum: ['Admin', 'Formateur', 'Stagiaire'],
        default: 'Stagiaire'
    },
    groupe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groupe' // Only needed if the user is a Stagiaire
    },
    isActive: {
        type: Boolean,
        default: true // Useful for Project 18 (Archiving) - we soft delete users instead of wiping them
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Modern Pre-save middleware (No 'next' callback needed for async functions)
userSchema.pre('save', async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;

    // Mongoose automatically catches errors in async hooks now, so no try/catch needed
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;