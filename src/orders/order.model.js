const mongoose = require('mongoose');

/**
 * Order Schema
 * Represents a customer order in the system
 */
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  address: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipcode: {
      type: String,
      required: [true, 'Zipcode is required'],
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zipcode']
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: [true, 'Product ID is required']
  }],
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'completed', 'cancelled'],
      message: 'Status must be one of: pending, processing, completed, cancelled'
    },
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed'],
      message: 'Payment status must be one of: pending, paid, failed'
    },
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order summary
orderSchema.virtual('orderSummary').get(function() {
  return {
    orderId: this._id,
    customerName: this.name,
    totalItems: this.productIds.length,
    totalPrice: this.totalPrice,
    status: this.status
  };
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = async function(newStatus) {
  this.paymentStatus = newStatus;
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;