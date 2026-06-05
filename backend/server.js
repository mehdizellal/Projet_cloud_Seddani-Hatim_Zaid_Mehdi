require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const filiereRoutes = require('./routes/filiereRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const competenceRoutes = require('./routes/competenceRoutes');
const absenceRoutes = require('./routes/absenceRoutes');

// Modules 5-9
const barremeRoutes = require('./routes/barremeRoutes');
const noteRoutes = require('./routes/noteRoutes');
const qcmRoutes = require('./routes/qcmRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const efmRoutes = require('./routes/efmRoutes');

// Connect to MongoDB
connectDB(); // <-- Add this

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/filieres', filiereRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/competences', competenceRoutes);
app.use('/api/absences', absenceRoutes);

// Modules 5-9 Routes
app.use('/api/barremes', barremeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/qcm', qcmRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/efm', efmRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'ISMO API is running!' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 ISMO Server running on port ${PORT}`);
});