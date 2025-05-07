const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const landRoutes = require('./src/land/land.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes = require('./src/stats/admin.stats');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Configure middleware
const configureMiddleware = () => {
  app.use(express.json());
  app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }));
};

// Configure routes
const configureRoutes = () => {
  app.use('/api/land', landRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/auth', userRoutes);
  app.use('/api/admin', adminRoutes);
  
  // Health check endpoint
  app.get('/', (req, res) => {
    res.send('Hello from Backend!');
  });
};

// Database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize application
const initializeApp = async () => {
  configureMiddleware();
  configureRoutes();
  await connectDatabase();
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// Start the application
initializeApp().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});