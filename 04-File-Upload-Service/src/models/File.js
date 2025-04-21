const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  encoding: {
    type: String
  },
  mimetype: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
});

// Add text index for search functionality
FileSchema.index({ 
  originalName: 'text', 
  'metadata.$**': 'text',
  tags: 'text' 
});

// Update lastAccessed timestamp when file is viewed
FileSchema.methods.updateLastAccessed = async function() {
  this.lastAccessed = Date.now();
  return this.save();
};

// Check if file is expired
FileSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Generate temporary sharing link with expiration
FileSchema.methods.generateSharingLink = async function(expirationMinutes = 60) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
  
  this.isPublic = true;
  this.expiresAt = expiresAt;
  await this.save();
  
  return {
    url: `/api/files/${this._id}/download?token=public`,
    expiresAt
  };
};

module.exports = mongoose.model('File', FileSchema);