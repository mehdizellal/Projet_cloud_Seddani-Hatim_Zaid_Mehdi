const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: [true, 'Une session doit être rattachée à un module']
    },
    formateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The teacher
        required: [true, 'Une session doit avoir un formateur']
    },
    groupe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groupe',
        required: [true, 'Une session doit être rattachée à un groupe']
    },
    date: {
        type: Date,
        required: [true, 'La date de la session est obligatoire']
    },
    startTime: {
        type: String, // e.g., "08:30"
        required: true
    },
    endTime: {
        type: String, // e.g., "11:00"
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Session', sessionSchema);