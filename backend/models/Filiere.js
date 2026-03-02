const mongoose = require('mongoose');

const filiereSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Le code de la filière est obligatoire (ex: DEV-DIG)'],
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Le nom de la filière est obligatoire'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Filiere', filiereSchema);