const Category = require('../models/Category');
const Note = require('../models/Note');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all categories for the logged in user
 * @route   GET /api/categories
 * @access  Private
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user.id })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Private
 */
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private
 */
exports.createCategory = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if category with same name exists for this user
    const existingCategory = await Category.findOne({
      name: req.body.name,
      user: req.user.id
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Check if parent category exists and belongs to user
    if (req.body.parent) {
      const parentCategory = await Category.findOne({
        _id: req.body.parent,
        user: req.user.id
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found or does not belong to user'
        });
      }
    }

    // Create category
    const category = await Category.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if new name conflicts with existing category
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: req.body.name,
        user: req.user.id,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Check for circular parent reference
    if (req.body.parent) {
      // Can't set parent to self
      if (req.body.parent === req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be its own parent'
        });
      }

      // Check if parent exists and belongs to user
      const parentCategory = await Category.findOne({
        _id: req.body.parent,
        user: req.user.id
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found or does not belong to user'
        });
      }
    }

    // Update category
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has notes
    const noteCount = await Note.countDocuments({
      category: req.params.id,
      user: req.user.id
    });

    if (noteCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it has ${noteCount} notes. Move or delete the notes first.`
      });
    }

    // Check if category has child categories
    const childCategories = await Category.countDocuments({
      parent: req.params.id,
      user: req.user.id
    });

    if (childCategories > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it has ${childCategories} child categories. Move or delete them first.`
      });
    }

    await category.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all notes for a category
 * @route   GET /api/categories/:id/notes
 * @access  Private
 */
exports.getCategoryNotes = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {
      category: req.params.id,
      user: req.user.id,
      isDeleted: false
    };

    // Get total count
    const total = await Note.countDocuments(query);

    // Get notes
    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: notes.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: notes
    });
  } catch (error) {
    next(error);
  }
};