const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Le code du module est obligatoire (ex: M101)'],
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Le nom du module est obligatoire'],
        trim: true
    },
    filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere', // This is the magic link to the Filiere model!
        required: [true, 'Un module doit être rattaché à une filière']
    },
    coefficient: {
        type: Number,
        default: 1,
        min: [1, 'Le coefficient minimum est 1']
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Module', moduleSchema);