const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  analytics: {
    referrers: {
      type: Map,
      of: Number,
      default: new Map()
    },
    browsers: {
      type: Map,
      of: Number,
      default: new Map()
    },
    devices: {
      type: Map,
      of: Number,
      default: new Map()
    }
  }
});

module.exports = mongoose.model('Url', UrlSchema);