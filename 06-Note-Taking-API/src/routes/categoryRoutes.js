const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Basic CRUD operations
router.route('/')
  .get(categoryController.getCategories)
  .post([
    body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name is required and must be less than 50 characters'),
    body('description').optional().trim().isLength({ max: 200 }).withMessage('Description must be less than 200 characters'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color code'),
    body('icon').optional().trim().isLength({ max: 50 }).withMessage('Icon must be less than 50 characters')
  ], categoryController.createCategory);

router.route('/:id')
  .get(categoryController.getCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

// Get all notes for a category
router.get('/:id/notes', categoryController.getCategoryNotes);

module.exports = router;