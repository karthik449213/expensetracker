const app = require('./app');
const connectDB = require('./config/db');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


/**
 * Connect to database and start server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('✗ Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();
