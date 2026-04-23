const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

/**
 * Global Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

/**
 * 404 Error Handler
 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/**
 * Global Error Handler (must be last)
 */
app.use(errorMiddleware);

module.exports = app;
