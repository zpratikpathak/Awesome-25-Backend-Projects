const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1']
      },
      price: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        required: true
      },
      image: {
        type: String
      }
    }
  ],
  shippingAddress: {
    name: {
      type: String,
      required: [true, 'Shipping name is required']
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required']
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  billingAddress: {
    name: {
      type: String,
      required: [true, 'Billing name is required']
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required']
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    type: Object
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  orderNotes: {
    type: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  trackingNumber: {
    type: String
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  shippedAt: Date,
  deliveredAt: Date
});

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
    return next();
  }
  
  // Generate unique order number format: YYYYMMDD-XXXX (X is random)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  this.orderNumber = `${year}${month}${day}-${random}`;
  next();
});

// Method to update order status
OrderSchema.methods.updateStatus = function(status, notes = '') {
  this.orderStatus = status;
  
  if (notes) {
    this.orderNotes = this.orderNotes 
      ? `${this.orderNotes}\n${new Date().toISOString()}: ${notes}`
      : `${new Date().toISOString()}: ${notes}`;
  }
  
  // Set status-specific timestamps
  if (status === 'shipped' && !this.shippedAt) {
    this.shippedAt = Date.now();
  } else if (status === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
  
  return this;
};

// Method to update payment status
OrderSchema.methods.updatePaymentStatus = function(status, details = null) {
  this.paymentStatus = status;
  
  if (details) {
    this.paymentDetails = details;
  }
  
  return this;
};

// Static method to get all orders for a user
OrderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', OrderSchema);