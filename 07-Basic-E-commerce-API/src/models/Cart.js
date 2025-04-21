const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
        default: 1
      },
      price: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        required: true
      }
    }
  ],
  totalItems: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
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

// Update cart totals pre save
CartSchema.pre('save', function(next) {
  // Calculate totals
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Update timestamp
  this.updatedAt = Date.now();
  
  next();
});

// Method to add item to cart
CartSchema.methods.addItem = async function(productId, quantity = 1) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (product.stock < quantity) {
    throw new Error('Not enough stock available');
  }
  
  // Check if product already in cart
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );
  
  if (itemIndex > -1) {
    // Product exists in cart, update quantity
    this.items[itemIndex].quantity += quantity;
    this.items[itemIndex].totalPrice = this.items[itemIndex].price * this.items[itemIndex].quantity;
  } else {
    // Product not in cart, add new item
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    
    this.items.push({
      product: productId,
      quantity,
      price,
      totalPrice: price * quantity
    });
  }
  
  return this;
};

// Method to update item quantity
CartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );
  
  if (itemIndex === -1) {
    throw new Error('Product not found in cart');
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    this.items.splice(itemIndex, 1);
  } else {
    // Update quantity and price
    this.items[itemIndex].quantity = quantity;
    this.items[itemIndex].totalPrice = this.items[itemIndex].price * quantity;
  }
  
  return this;
};

// Method to remove item from cart
CartSchema.methods.removeItem = function(productId) {
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );
  
  if (itemIndex === -1) {
    throw new Error('Product not found in cart');
  }
  
  this.items.splice(itemIndex, 1);
  return this;
};

// Method to clear cart
CartSchema.methods.clearCart = function() {
  this.items = [];
  return this;
};

module.exports = mongoose.model('Cart', CartSchema);