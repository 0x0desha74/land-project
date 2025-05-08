const { Order, Land, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Error response helper
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Success response helper
const successResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalSales,
      totalLands,
      trendingLands,
      recentOrders
    ] = await Promise.all([
      Order.count(),
      Order.sum('totalPrice'),
      Land.count(),
      Land.count({ where: { trending: true } }),
      Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{ model: Land }]
      })
    ]);

    // Get monthly sales
    const monthlySales = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalSales'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
        [sequelize.fn('AVG', sequelize.col('totalPrice')), 'averageOrderValue']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
    });

    // Get category distribution
    const categoryDistribution = await Land.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });

    return successResponse(res, 200, 'Dashboard statistics retrieved successfully', {
      overview: {
        totalOrders,
        totalSales: totalSales || 0,
        averageOrderValue: totalSales / totalOrders || 0,
        totalLands,
        trendingLands
      },
      monthlySales,
      categoryDistribution,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return errorResponse(res, 500, 'Failed to fetch dashboard statistics');
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const format = period === 'monthly' ? '%Y-%m' : '%Y-%m-%d';

    const orderStats = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), format), 'period'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalSales'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
        [sequelize.fn('AVG', sequelize.col('totalPrice')), 'averageOrderValue']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), format)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), format), 'ASC']]
    });

    return successResponse(res, 200, 'Order statistics retrieved successfully', {
      period,
      stats: orderStats
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return errorResponse(res, 500, 'Failed to fetch order statistics');
  }
};

// Get land statistics
const getLandStats = async (req, res) => {
  try {
    const [
      categoryStats,
      priceStats,
      trendingStats
    ] = await Promise.all([
      Land.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category']
      }),
      Land.findAll({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('newPrice')), 'averagePrice'],
          [sequelize.fn('MIN', sequelize.col('newPrice')), 'minPrice'],
          [sequelize.fn('MAX', sequelize.col('newPrice')), 'maxPrice']
        ]
      }),
      Land.count({ where: { trending: true } })
    ]);

    return successResponse(res, 200, 'Land statistics retrieved successfully', {
      categoryStats,
      priceStats: priceStats[0],
      trendingStats
    });
  } catch (error) {
    console.error('Error fetching land statistics:', error);
    return errorResponse(res, 500, 'Failed to fetch land statistics');
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const [
      totalUsers,
      adminUsers,
      recentUsers,
      userActivity
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: 'admin' } }),
      User.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']]
      }),
      User.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('lastLogin'), '%Y-%m'), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'activeUsers']
        ],
        where: {
          lastLogin: { [Op.not]: null }
        },
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('lastLogin'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('lastLogin'), '%Y-%m'), 'DESC']],
        limit: 12
      })
    ]);

    return successResponse(res, 200, 'User statistics retrieved successfully', {
      totalUsers,
      adminUsers,
      recentUsers,
      userActivity
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return errorResponse(res, 500, 'Failed to fetch user statistics');
  }
};

module.exports = {
  getDashboardStats,
  getOrderStats,
  getLandStats,
  getUserStats
}; 