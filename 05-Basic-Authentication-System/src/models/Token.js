const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['refresh', 'access', 'reset', 'verification'],
    default: 'refresh'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // Token expires after 7 days
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  userAgent: String
});

// Index for faster lookups
TokenSchema.index({ user: 1, token: 1 });

module.exports = mongoose.model('Token', TokenSchema);