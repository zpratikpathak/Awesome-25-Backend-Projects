const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  reminder: {
    date: Date,
    isSet: {
      type: Boolean,
      default: false
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'edit'],
      default: 'read'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set updatedAt on save
NoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search
NoteSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, content: 5, tags: 3 } }
);

// Add a compound index for user and categories for faster lookups
NoteSchema.index({ user: 1, category: 1 });

// Add compound index for archived and deleted filters
NoteSchema.index({ user: 1, isArchived: 1, isDeleted: 1 });

module.exports = mongoose.model('Note', NoteSchema);