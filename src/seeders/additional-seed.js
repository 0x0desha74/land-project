const { User, Land, Order } = require('../models');

const seedAdditionalData = async () => {
  try {
    // Create additional users
    const additionalUsers = await User.bulkCreate([
      {
        username: 'realtor1',
        email: 'realtor1@example.com',
        password: 'realtor123',
        role: 'user'
      },
      {
        username: 'investor1',
        email: 'investor1@example.com',
        password: 'investor123',
        role: 'user'
      }
    ]);

    // Create additional lands
    const additionalLands = await Land.bulkCreate([
      {
        title: 'Beachfront Condo',
        description: 'Stunning beachfront condo with panoramic ocean views, modern amenities, and private beach access.',
        category: 'residential',
        trending: true,
        coverImage: 'condo1.jpg',
        oldPrice: 850000,
        newPrice: 795000
      },
      {
        title: 'Shopping Mall',
        description: 'Prime location shopping mall with high foot traffic, multiple anchor tenants, and ample parking.',
        category: 'commercial',
        trending: true,
        coverImage: 'mall1.jpg',
        oldPrice: 3500000,
        newPrice: 3200000
      },
      {
        title: 'Vineyard Estate',
        description: 'Beautiful vineyard estate with wine production facilities, tasting room, and guest accommodations.',
        category: 'agricultural',
        trending: true,
        coverImage: 'vineyard1.jpg',
        oldPrice: 2800000,
        newPrice: 2500000
      },
      {
        title: 'Tech Park',
        description: 'Modern tech park with multiple office buildings, conference facilities, and green spaces.',
        category: 'industrial',
        trending: true,
        coverImage: 'techpark1.jpg',
        oldPrice: 4200000,
        newPrice: 3800000
      },
      {
        title: 'Mountain View Estate',
        description: 'Luxurious mountain view estate with panoramic views, private hiking trails, and modern amenities.',
        category: 'residential',
        trending: false,
        coverImage: 'mountain1.jpg',
        oldPrice: 2200000,
        newPrice: 2000000
      }
    ]);

    // Create additional orders
    const additionalOrders = await Order.bulkCreate([
      {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        address: {
          city: 'Chicago',
          country: 'USA',
          state: 'IL',
          zipcode: '60601'
        },
        phone: '+1777888999',
        totalPrice: 795000,
        status: 'processing',
        paymentStatus: 'paid'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        address: {
          city: 'Miami',
          country: 'USA',
          state: 'FL',
          zipcode: '33101'
        },
        phone: '+1555666777',
        totalPrice: 2500000,
        status: 'pending',
        paymentStatus: 'pending'
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        address: {
          city: 'Seattle',
          country: 'USA',
          state: 'WA',
          zipcode: '98101'
        },
        phone: '+1444555666',
        totalPrice: 3800000,
        status: 'completed',
        paymentStatus: 'paid'
      }
    ]);

    // Associate lands with orders
    await additionalOrders[0].setLands([additionalLands[0].id]); // Beachfront Condo
    await additionalOrders[1].setLands([additionalLands[2].id]); // Vineyard Estate
    await additionalOrders[2].setLands([additionalLands[3].id]); // Tech Park

    console.log('Additional data seeded successfully!');
    console.log('Created:', {
      users: additionalUsers.length,
      lands: additionalLands.length,
      orders: additionalOrders.length
    });

  } catch (error) {
    console.error('Error seeding additional data:', error);
  }
};

module.exports = seedAdditionalData; 