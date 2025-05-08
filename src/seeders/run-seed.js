const { sequelize } = require('../models');
const seedAdditionalData = require('./additional-seed');

const runSeed = async () => {
  try {
    // Run the additional seeding
    await seedAdditionalData();
    
    console.log('All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

runSeed(); 