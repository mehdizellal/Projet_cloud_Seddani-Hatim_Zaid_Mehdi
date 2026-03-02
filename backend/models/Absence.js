const mongoose = require('mongoose');

const absenceSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    stagiaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The trainee
        required: true
    },
    status: {
        type: String,
        enum: ['Présent', 'Absent', 'Retard', 'Justifié'],
        default: 'Présent'
    },
    remarks: {
        type: String,
        trim: true // e.g., "Arrivé avec 15 minutes de retard"
    }
}, { 
    timestamps: true 
});

// Ensure a trainee only has ONE attendance record per session
absenceSchema.index({ session: 1, stagiaire: 1 }, { unique: true });

module.exports = mongoose.model('Absence', absenceSchema);