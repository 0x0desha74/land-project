const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'landDB',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'localhost@569',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'landDB'};`);
    console.log('Database is ready');

    // Use the database
    await sequelize.query(`USE ${process.env.DB_NAME || 'landDB'};`);
    console.log('Connected to database');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Import models
    require('../models');

    // Sync all models
    await sequelize.sync();
    console.log('Database tables synchronized successfully');

    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  initDatabase
}; 