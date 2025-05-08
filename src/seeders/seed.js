const { User, Land, Order } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    // Create sample lands
    const lands = await Land.bulkCreate([
      {
        title: 'Luxury Villa',
        description: 'Beautiful luxury villa with ocean view, 5 bedrooms, 4 bathrooms, and a private pool.',
        category: 'residential',
        trending: true,
        coverImage: 'villa1.jpg',
        oldPrice: 1500000,
        newPrice: 1350000
      },
      {
        title: 'Commercial Plaza',
        description: 'Prime location commercial plaza with high foot traffic, perfect for retail businesses.',
        category: 'commercial',
        trending: true,
        coverImage: 'plaza1.jpg',
        oldPrice: 2500000,
        newPrice: 2200000
      },
      {
        title: 'Agricultural Land',
        description: 'Fertile agricultural land with irrigation system, perfect for farming.',
        category: 'agricultural',
        trending: false,
        coverImage: 'farm1.jpg',
        oldPrice: 500000,
        newPrice: 450000
      },
      {
        title: 'Industrial Warehouse',
        description: 'Large industrial warehouse with loading docks and office space.',
        category: 'industrial',
        trending: true,
        coverImage: 'warehouse1.jpg',
        oldPrice: 1800000,
        newPrice: 1600000
      }
    ]);

    // Create sample orders
    const orders = await Order.bulkCreate([
      {
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          city: 'New York',
          country: 'USA',
          state: 'NY',
          zipcode: '10001'
        },
        phone: '+1234567890',
        totalPrice: 1350000,
        status: 'completed',
        paymentStatus: 'paid'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        address: {
          city: 'Los Angeles',
          country: 'USA',
          state: 'CA',
          zipcode: '90001'
        },
        phone: '+1987654321',
        totalPrice: 450000,
        status: 'pending',
        paymentStatus: 'pending'
      }
    ]);

    // Associate lands with orders
    await orders[0].setLands([lands[0].id]); // First order with luxury villa
    await orders[1].setLands([lands[2].id]); // Second order with agricultural land

    console.log('Database seeded successfully!');
    console.log('Created:', {
      users: 2,
      lands: lands.length,
      orders: orders.length
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase; 