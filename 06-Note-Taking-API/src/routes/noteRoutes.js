const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Search endpoint - place before other routes to avoid conflict with :id
router.get('/search', noteController.searchNotes);

// Basic CRUD operations
router.route('/')
  .get(noteController.getNotes)
  .post([
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
  ], noteController.createNote);

router.route('/:id')
  .get(noteController.getNote)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

// Additional operations
router.delete('/:id/permanent', noteController.permanentlyDeleteNote);
router.put('/:id/archive', noteController.toggleArchiveStatus);
router.post('/:id/share', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('permission').isIn(['read', 'edit']).withMessage('Permission must be either read or edit')
], noteController.shareNote);

module.exports = router;