const sequelize = require('./database');
const User = require('../users/user.model');
const Land = require('../land/land.model');
const Order = require('../orders/order.model');

// Sync all models with database
const initDatabase = async () => {
  try {
    // Force create all tables
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create admin user if not exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }

    // Create some sample lands
    const landsCount = await Land.count();
    if (landsCount === 0) {
      await Land.bulkCreate([
        {
          title: 'Beautiful Residential Plot',
          description: 'A perfect residential plot in a prime location',
          category: 'residential',
          trending: true,
          coverImage: 'https://example.com/image1.jpg',
          oldPrice: 1000000,
          newPrice: 950000
        },
        {
          title: 'Commercial Space',
          description: 'Prime commercial space in business district',
          category: 'commercial',
          trending: false,
          coverImage: 'https://example.com/image2.jpg',
          oldPrice: 2000000,
          newPrice: 1900000
        }
      ]);
      console.log('Sample lands created successfully');
    }

    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

module.exports = initDatabase; 