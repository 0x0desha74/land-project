const sequelize = require('./config/database');
const User = require('./users/user.model');
const Land = require('./land/land.model');
const Order = require('./orders/order.model');

const testDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test connection and sync models
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      role: 'user'
    });
    console.log('Test user created successfully:', testUser.username);

    // Test user retrieval
    const users = await User.findAll();
    console.log('Users in database:', users.length);

    // Test Land model
    console.log('\nTesting Land model...');
    const lands = await Land.findAll();
    console.log('Lands in database:', lands.length);
    
    // Test Order model
    console.log('\nTesting Order model...');
    const orders = await Order.findAll();
    console.log('Orders in database:', orders.length);

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testDatabase(); 