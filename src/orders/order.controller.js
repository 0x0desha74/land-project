const { Order, Land } = require('../models');

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

// Create new order
const createOrder = async (req, res) => {
  try {
    const { landIds, ...orderData } = req.body;
    const order = await Order.create(orderData);
    
    if (landIds && landIds.length > 0) {
      await order.setLands(landIds);
    }
    
    const orderWithLands = await Order.findByPk(order.id, {
      include: [{ model: Land }]
    });
    
    return successResponse(res, 201, 'Order created successfully', orderWithLands);
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse(res, 500, 'Failed to create order');
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Land }],
      order: [['createdAt', 'DESC']]
    });
    return successResponse(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse(res, 500, 'Failed to fetch orders');
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: Land }]
    });
    
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }
    
    return successResponse(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return errorResponse(res, 500, 'Failed to fetch order');
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [updated] = await Order.update(
      { status },
      { where: { id } }
    );
    
    if (!updated) {
      return errorResponse(res, 404, 'Order not found');
    }
    
    const updatedOrder = await Order.findByPk(id, {
      include: [{ model: Land }]
    });
    
    return successResponse(res, 200, 'Order status updated successfully', updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return errorResponse(res, 500, 'Failed to update order status');
  }
};

// Delete order (admin only)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return errorResponse(res, 404, 'Order not found');
    }
    
    return successResponse(res, 200, 'Order deleted successfully');
  } catch (error) {
    console.error('Error deleting order:', error);
    return errorResponse(res, 500, 'Failed to delete order');
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { email: req.user.email },
      include: [{ model: Land }],
      order: [['createdAt', 'DESC']]
    });
    
    return successResponse(res, 200, 'User orders retrieved successfully', orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return errorResponse(res, 500, 'Failed to fetch user orders');
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
};