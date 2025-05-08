const { sequelize } = require('../config/database');
const User = require('../users/user.model');
const Land = require('../land/land.model');
const Order = require('../orders/order.model');

// Define associations
Order.belongsToMany(Land, { through: 'OrderLands' });
Land.belongsToMany(Order, { through: 'OrderLands' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Land,
  Order
}; 