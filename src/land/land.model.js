const mongoose = require('mongoose');

// Land data structure
const landSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['residential', 'commercial', 'agricultural', 'industrial'],
      message: 'Category must be one of: residential, commercial, agricultural, industrial'
    }
  },
  trending: {
    type: Boolean,
    required: [true, 'Trending status is required'],
    default: false
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image URL is required'],
    trim: true
  },
  oldPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price cannot be negative']
  },
  newPrice: {
    type: Number,
    required: [true, 'New price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.oldPrice;
      },
      message: 'New price must be less than or equal to the original price'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Speed up searches
landSchema.index({ title: 'text', description: 'text' });
landSchema.index({ category: 1, trending: 1 });

// Get price discount
landSchema.virtual('discountPercentage').get(function() {
  if (!this.oldPrice || !this.newPrice) return 0;
  return Math.round(((this.oldPrice - this.newPrice) / this.oldPrice) * 100);
});

const Land = mongoose.model('Land', landSchema);

module.exports = Land;