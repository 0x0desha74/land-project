const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Order data structure
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      hasRequiredFields(value) {
        if (!value.city || !value.country || !value.state || !value.zipcode) {
          throw new Error('Address must include city, country, state, and zipcode');
        }
        if (!/^\d{5}(-\d{4})?$/.test(value.zipcode)) {
          throw new Error('Invalid zipcode format');
        }
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\+?[\d\s-]{10,}$/
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  getterMethods: {
    orderSummary() {
      return {
        orderId: this.id,
        customerName: this.name,
        totalItems: this.Lands ? this.Lands.length : 0,
        totalPrice: this.totalPrice,
        status: this.status
      };
    }
  }
});

module.exports = Order;