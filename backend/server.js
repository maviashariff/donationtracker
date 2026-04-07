require('dotenv').config();
const express = require('express');
const cors = require('cors');
const seed = require('./seed');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Auto-seed database on first start
seed();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/updates', require('./routes/updates'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Donation Tracking System API',
    client: 'Shaji',
    roll: 'SB230347',
    status: 'running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});