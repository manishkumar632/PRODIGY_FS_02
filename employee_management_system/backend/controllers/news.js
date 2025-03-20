const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single news item
// @route   GET /api/news/:id
// @access  Public
exports.getNewsItem = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: `News item not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: newsItem
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create new news item
// @route   POST /api/news
// @access  Private (Admin only)
exports.createNews = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    const newsItem = await News.create(req.body);

    res.status(201).json({
      success: true,
      data: newsItem
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update news item
// @route   PUT /api/news/:id
// @access  Private (Admin only)
exports.updateNews = async (req, res) => {
  try {
    let newsItem = await News.findById(req.params.id);

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: `News item not found with id of ${req.params.id}`
      });
    }

    newsItem = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: newsItem
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete news item
// @route   DELETE /api/news/:id
// @access  Private (Admin only)
exports.deleteNews = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: `News item not found with id of ${req.params.id}`
      });
    }

    await newsItem.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}; 