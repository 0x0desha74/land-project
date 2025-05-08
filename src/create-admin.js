const { User } = require('./models');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    // Delete existing admin if exists
    await User.destroy({
      where: { email: 'admin@example.com' }
    });

    // Create new admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin(); 