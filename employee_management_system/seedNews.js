const mongoose = require('mongoose');
const News = require('./models/News');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding news...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedNews = async () => {
  try {
    // Check if news items already exist
    const count = await News.countDocuments();
    
    if (count > 0) {
      console.log(`${count} news items already exist in the database`);
      return process.exit(0);
    }
    
    // Find admin user to set as creator
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.error('Admin user not found. Please run seedAdmin.js first.');
      return process.exit(1);
    }
    
    const sampleNews = [
      {
        title: 'Company Announces New Benefits Package',
        content: 'We are excited to announce our new comprehensive benefits package that includes improved health insurance, additional vacation days, and a new wellness program. These changes will take effect starting next month.',
        image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdBy: adminUser._id
      },
      {
        title: 'Quarterly Team Building Event',
        content: 'Join us for our quarterly team building event at Central Park this Friday. Activities will include team challenges, outdoor games, and a catered lunch. Please RSVP by Wednesday.',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdBy: adminUser._id
      },
      {
        title: 'New Project Management System Rollout',
        content: 'Starting next week, we will be transitioning to a new project management system. Training sessions will be held throughout the week. Please check your email for your assigned training slot.',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdBy: adminUser._id
      },
      {
        title: 'Congratulations to Our Employee of the Month',
        content: 'Please join us in congratulating Jane Smith for being named Employee of the Month! Jane has shown exceptional dedication and innovation in her recent project work.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdBy: adminUser._id
      },
      {
        title: 'Office Closure for Holiday',
        content: 'Please note that the office will be closed on Monday, July 4th in observance of Independence Day. Regular operations will resume on Tuesday, July 5th.',
        image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdBy: adminUser._id
      }
    ];
    
    // Insert sample news
    await News.insertMany(sampleNews);
    
    console.log(`${sampleNews.length} news items added successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exit(1);
  }
};

seedNews(); 