const express = require('express');
const cors = require('cors');
const { sequelize, initDatabase } = require('./src/config/database');
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
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

// Configure routes
app.use('/api/land', landRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize application
const initializeApp = async () => {
  try {
    // Initialize database
    const dbInitialized = await initDatabase();
    if (!dbInitialized) {
      throw new Error('Failed to initialize database');
    }
    
    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

initializeApp();