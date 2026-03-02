const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Le code de la compétence est obligatoire (ex: C01)'],
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'L\'intitulé de la compétence est obligatoire'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module', // The magic link to our Module model!
        required: [true, 'Une compétence doit être rattachée à un module']
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Competence', competenceSchema);