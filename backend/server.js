require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const filiereRoutes = require('./routes/filiereRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const competenceRoutes = require('./routes/competenceRoutes');
const absenceRoutes = require('./routes/absenceRoutes');

// Connect to MongoDB
connectDB(); // <-- Add this

const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/filieres', filiereRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/competences', competenceRoutes);
app.use('/api/absences', absenceRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'ISMO API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 ISMO Server running on port ${PORT}`);
});