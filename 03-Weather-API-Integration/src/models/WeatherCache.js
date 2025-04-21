const mongoose = require('mongoose');

const WeatherCacheSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['current', 'forecast', 'historical'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  coordinates: {
    lat: Number,
    lon: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Cache expires after 1 hour (in seconds)
  }
});

// Compound index for faster lookups
WeatherCacheSchema.index({ location: 1, type: 1 });

module.exports = mongoose.model('WeatherCache', WeatherCacheSchema);