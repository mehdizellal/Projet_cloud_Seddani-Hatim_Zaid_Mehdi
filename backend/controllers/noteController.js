const Note = require('../models/Note');
const noteService = require('../services/noteService');

exports.createNote = async (req, res) => {
    try {
        noteService.validateNote(req.body);
        const note = new Note(req.body);
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        if (req.body.note !== undefined) {
            noteService.validateNote(req.body);
        }
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find(req.query);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.importCsv = async (req, res) => {
    try {
        // En supposant que le fichier est uploadé et accessible via req.file.path
        const filePath = req.file ? req.file.path : 'dummy.csv';
        const notes = await noteService.importCsvService(filePath);
        res.status(200).json({ message: "Import réussi", data: notes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateNoteStatus = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note introuvable" });
        note.statut = 'VALIDE';
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.publishNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note introuvable" });
        note.statut = 'PUBLIE';
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
