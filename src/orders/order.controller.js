const Order = require('./order.model');

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

// Make new order
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    return successResponse(res, 201, 'Order created successfully', savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse(res, 500, 'Failed to create order');
  }
};

// Get user orders
const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .populate('productIds')
      .lean();

    if (!orders.length) {
      return errorResponse(res, 404, 'No orders found for this email');
    }

    return successResponse(res, 200, 'Orders retrieved successfully', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse(res, 500, 'Failed to fetch orders');
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('productIds')
      .lean();

    return successResponse(res, 200, 'Orders retrieved successfully', { orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return errorResponse(res, 500, 'Failed to fetch orders');
  }
};

// Change order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    await order.updateStatus(status);
    return successResponse(res, 200, 'Order status updated successfully', order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return errorResponse(res, 500, 'Failed to update order status');
  }
};

// Get order numbers
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' }
        }
      }
    ]);

    return successResponse(res, 200, 'Order statistics retrieved successfully', { stats });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return errorResponse(res, 500, 'Failed to fetch order statistics');
  }
};

module.exports = {
  createOrder,
  getOrdersByEmail,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};