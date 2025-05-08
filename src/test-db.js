const { sequelize } = require('./config/database');
const { User, Land, Order } = require('./models');

const testDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Create test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      role: 'user'
    });
    console.log('Test user created:', testUser.email);

    // Create test land
    const testLand = await Land.create({
      title: 'Test Property',
      description: 'This is a test property',
      category: 'residential',
      trending: true,
      coverImage: 'test.jpg',
      oldPrice: 100000,
      newPrice: 90000
    });
    console.log('Test land created:', testLand.title);

    // Create test order
    const testOrder = await Order.create({
      name: 'Test Customer',
      email: 'customer@example.com',
      address: {
        city: 'Test City',
        country: 'Test Country',
        state: 'TS',
        zipcode: '12345'
      },
      phone: '+1234567890',
      totalPrice: 90000,
      status: 'pending',
      paymentStatus: 'pending'
    });
    console.log('Test order created');

    // Associate land with order
    await testOrder.setLands([testLand.id]);
    console.log('Land associated with order');

    console.log('All test data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testDatabase(); 