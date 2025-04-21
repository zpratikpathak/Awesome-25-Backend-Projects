const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for a review']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required for a review']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide review text'],
    trim: true,
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// A user can only review a product once
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update the updatedAt field
ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// After saving a review, update the product's average rating
ReviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    await product.updateRatings();
    await product.save();
  }
});

// After deleting a review, update the product's average rating
ReviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    await product.updateRatings();
    await product.save();
  }
});

module.exports = mongoose.model('Review', ReviewSchema);