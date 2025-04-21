const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  color: {
    type: String,
    default: '#4285F4'  // Default blue color
  },
  icon: {
    type: String,
    default: 'folder'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster lookups
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

// Pre-remove hook to prevent deletion if it has notes
CategorySchema.pre('remove', async function(next) {
  const Note = mongoose.model('Note');
  const noteCount = await Note.countDocuments({ category: this._id });
  
  if (noteCount > 0) {
    next(new Error(`Cannot delete category because it has ${noteCount} notes`));
  } else {
    next();
  }
});

module.exports = mongoose.model('Category', CategorySchema);