const Note = require('../models/Note');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const marked = require('marked');
const sanitizeHtml = require('sanitize-html');

/**
 * @desc    Get all notes for the logged in user
 * @route   GET /api/notes
 * @access  Private
 */
exports.getNotes = async (req, res, next) => {
  try {
    const query = { 
      user: req.user.id,
      isDeleted: false
    };

    // Handle filtering by archived status
    if (req.query.archived === 'true') {
      query.isArchived = true;
    } else if (req.query.archived === 'false') {
      query.isArchived = false;
    }

    // Handle filtering by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Handle filtering by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Sorting
    const sortField = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDir === 'asc' ? 1 : -1;
    const sort = {};
    sort[sortField] = sortDirection;

    // First get total count
    const total = await Note.countDocuments(query);

    // Then get the notes
    const notes = await Note.find(query)
      .populate('category', 'name color icon')
      .sort(sort)
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

/**
 * @desc    Get single note
 * @route   GET /api/notes/:id
 * @access  Private
 */
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('category', 'name color icon');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if user owns the note or has it shared with them
    const isOwner = note.user.toString() === req.user.id;
    const isSharedWithUser = note.sharedWith.some(
      share => share.user.toString() === req.user.id
    );

    if (!isOwner && !isSharedWithUser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this note'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new note
 * @route   POST /api/notes
 * @access  Private
 */
exports.createNote = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Sanitize content if it's markdown
    if (req.body.content) {
      const renderedHtml = marked(req.body.content);
      req.body.content = sanitizeHtml(renderedHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title']
        }
      });
    }

    // Check if category exists and belongs to user
    if (req.body.category) {
      const category = await Category.findOne({
        _id: req.body.category,
        user: req.user.id
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found or does not belong to user'
        });
      }
    }

    // Create note
    const note = await Note.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update note
 * @route   PUT /api/notes/:id
 * @access  Private
 */
exports.updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if user owns the note or has edit permission
    const isOwner = note.user.toString() === req.user.id;
    const hasEditPermission = note.sharedWith.some(
      share => share.user.toString() === req.user.id && share.permission === 'edit'
    );

    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    // Sanitize content if it's markdown
    if (req.body.content) {
      const renderedHtml = marked(req.body.content);
      req.body.content = sanitizeHtml(renderedHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title']
        }
      });
    }

    // Check if category exists and belongs to user
    if (req.body.category) {
      const category = await Category.findOne({
        _id: req.body.category,
        user: req.user.id
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found or does not belong to user'
        });
      }
    }

    // Update note
    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    // Soft delete: mark as deleted
    note.isDeleted = true;
    await note.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Permanently delete note
 * @route   DELETE /api/notes/:id/permanent
 * @access  Private
 */
exports.permanentlyDeleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    // Permanently delete
    await note.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Archive/Unarchive note
 * @route   PUT /api/notes/:id/archive
 * @access  Private
 */
exports.toggleArchiveStatus = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this note'
      });
    }

    // Toggle archive status
    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Share note with another user
 * @route   POST /api/notes/:id/share
 * @access  Private
 */
exports.shareNote = async (req, res, next) => {
  try {
    const { email, permission } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email'
      });
    }

    // Find the user to share with
    const User = require('../models/User');
    const shareWithUser = await User.findOne({ email });

    if (!shareWithUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to share this note'
      });
    }

    // Check if already shared
    const alreadyShared = note.sharedWith.find(
      share => share.user.toString() === shareWithUser._id.toString()
    );

    if (alreadyShared) {
      // Update permission
      alreadyShared.permission = permission || 'read';
    } else {
      // Add to shared list
      note.sharedWith.push({
        user: shareWithUser._id,
        permission: permission || 'read'
      });
    }

    await note.save();

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search notes
 * @route   GET /api/notes/search
 * @access  Private
 */
exports.searchNotes = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const notes = await Note.find({
      $text: { $search: q },
      user: req.user.id,
      isDeleted: false
    })
      .select('title content category tags createdAt updatedAt')
      .populate('category', 'name color')
      .sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};