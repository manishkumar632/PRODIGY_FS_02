const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', messageController.createMessage);

// Protected routes (require authentication)
router.get('/user/:userId', protect, messageController.getUserMessages);
router.get('/:id', protect, messageController.getMessageById);
router.put('/:id/status', protect, messageController.updateMessageStatus);
router.post('/:id/reply', protect, messageController.addReply);
router.put('/:id/mark-replies-read', protect, messageController.markRepliesAsRead);

// Admin routes
router.get('/', protect, admin, messageController.getAllMessages);
router.delete('/:id', protect, admin, messageController.deleteMessage);
router.delete('/user/:userId', protect, admin, messageController.deleteAllUserMessages);

module.exports = router; 