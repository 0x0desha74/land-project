const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Land data structure
const Land = sequelize.define('Land', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 1000]
    }
  },
  category: {
    type: DataTypes.ENUM('residential', 'commercial', 'agricultural', 'industrial'),
    allowNull: false
  },
  trending: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  oldPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  newPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      customValidator(value) {
        if (value > this.oldPrice) {
          throw new Error('New price must be less than or equal to the original price');
        }
      }
    }
  }
}, {
  timestamps: true,
  getterMethods: {
    discountPercentage() {
      if (!this.oldPrice || !this.newPrice) return 0;
      return Math.round(((this.oldPrice - this.newPrice) / this.oldPrice) * 100);
    }
  }
});

module.exports = Land;