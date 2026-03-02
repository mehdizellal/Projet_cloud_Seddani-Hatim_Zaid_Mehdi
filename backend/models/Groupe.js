const mongoose = require('mongoose');

const groupeSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: [true, 'Le code du groupe est obligatoire (ex: DEV101)'],
        unique: true,
        trim: true,
        uppercase: true
    },
    filiere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Filiere', 
        required: [true, 'Un groupe doit être rattaché à une filière'] 
    },
    anneeScolaire: { 
        type: String, 
        required: [true, 'L\'année scolaire est obligatoire (ex: 2025/2026)'] 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Groupe', groupeSchema);