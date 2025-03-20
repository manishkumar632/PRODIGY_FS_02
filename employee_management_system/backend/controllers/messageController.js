const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all messages (admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    const messages = await Message.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get messages for a specific user
exports.getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const messages = await Message.find({ userId }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error getting user messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a single message by ID
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }
    
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { name, email, subject, message, userId } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message'
      });
    }
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      userId: userId || null,
      status: 'unread',
      replies: []
    });
    
    await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update message status (mark as read/unread)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }
    
    // Validate status
    if (!status || !['read', 'unread'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be either "read" or "unread"'
      });
    }
    
    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Message marked as ${status}`,
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Add a reply to a message
exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, isAdmin, adminId } = req.body;
    
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }
    
    // Validate reply message
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }
    
    // Create reply object
    const reply = {
      message,
      isAdmin: isAdmin || false,
      adminId: adminId || null,
      createdAt: new Date(),
      isRead: false
    };
    
    // Add reply to message
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { 
        $push: { replies: reply },
        hasNewReplies: true,
        // If admin is replying, mark the message as read
        ...(isAdmin ? { status: 'read' } : {})
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Mark replies as read
exports.markRepliesAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }
    
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Mark all replies as read and turn off notification
    message.replies.forEach(reply => {
      reply.isRead = true;
    });
    message.hasNewReplies = false;
    
    await message.save();
    
    res.status(200).json({
      success: true,
      message: 'All replies marked as read',
      data: message
    });
  } catch (error) {
    console.error('Error marking replies as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }
    
    const message = await Message.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete all messages for a user
exports.deleteAllUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const result = await Message.deleteMany({ userId });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} messages deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting user messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 