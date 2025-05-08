const express = require('express');
const Order = require('../orders/order.model');
const Land = require('../land/land.model');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');

const router = express.Router();

// Send error message
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Send success message
const successResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// Get main dashboard info
const getDashboardStats = async (req, res) => {
  try {
    // Get sales info
    const [totalOrders, totalSales] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' },
            averageOrderValue: { $avg: '$totalPrice' }
          }
        }
      ])
    ]);

    // Get land info
    const [totalLands, trendingLands] = await Promise.all([
      Land.countDocuments(),
      Land.countDocuments({ trending: true })
    ]);

    // Get monthly sales
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get land categories
    const categoryDistribution = await Land.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get latest orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('productIds')
      .lean();

    return successResponse(res, 200, 'Dashboard statistics retrieved successfully', {
      overview: {
        totalOrders,
        totalSales: totalSales[0]?.totalSales || 0,
        averageOrderValue: totalSales[0]?.averageOrderValue || 0,
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

// Get sales info by time
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const format = period === 'monthly' ? '%Y-%m' : '%Y-%m-%d';

    const salesAnalytics = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return successResponse(res, 200, 'Sales analytics retrieved successfully', {
      period,
      analytics: salesAnalytics
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return errorResponse(res, 500, 'Failed to fetch sales analytics');
  }
};

// Routes
router.get('/', verifyAdminToken, getDashboardStats);
router.get('/sales', verifyAdminToken, getSalesAnalytics);

module.exports = router;