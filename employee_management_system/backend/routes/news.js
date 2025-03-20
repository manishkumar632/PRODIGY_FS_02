const express = require('express');
const {
  getNews,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/news');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getNews);
router.get('/:id', getNewsItem);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createNews);
router.put('/:id', protect, authorize('admin'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router; 