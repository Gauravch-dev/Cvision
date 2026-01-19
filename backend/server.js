require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const jobRequirementsRouter = require('./routes/jobRequirements');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/job-requirements', jobRequirementsRouter);

// Your existing routes
// app.post('/extract-resume', ...); // Keep your existing routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: 'connected'
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});