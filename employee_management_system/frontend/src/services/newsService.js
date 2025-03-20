import axiosInstance from './axiosConfig';

const API_ENDPOINT = '/news';

// Sample news data for fallback when backend is unavailable
const SAMPLE_NEWS = [
  {
    _id: '1',
    title: 'New Employee Management Features Released',
    date: '2023-06-15T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3',
    content: "We're excited to announce the release of new features that will enhance your employee management experience.",
    createdBy: '1',
    createdAt: '2023-06-15T00:00:00.000Z'
  },
  {
    _id: '2',
    title: 'Company Expands to New Markets',
    date: '2023-05-22T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3',
    content: "We're thrilled to announce our expansion into new markets, bringing our employee management solutions to more businesses.",
    createdBy: '1',
    createdAt: '2023-05-22T00:00:00.000Z'
  },
  {
    _id: '3',
    title: 'Annual Employee Management Conference',
    date: '2023-04-10T00:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3',
    content: "Join us for our annual conference where industry leaders share insights on employee management best practices.",
    createdBy: '1',
    createdAt: '2023-04-10T00:00:00.000Z'
  }
];

// Store news in memory for demo mode
let inMemoryNews = [...SAMPLE_NEWS];

// Get all news
export const getNews = async () => {
  try {
    console.log('Fetching news items...');
    const response = await axiosInstance.get(API_ENDPOINT);
    console.log('News items fetched successfully:', response.data);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    
    return {
      success: false,
      message: 'Invalid response format from server',
      data: []
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // If backend is unavailable, return in-memory data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, using in-memory news data');
      return {
        success: true,
        data: inMemoryNews
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch news',
      data: []
    };
  }
};

// Get news by ID
export const getNewsById = async (id) => {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Invalid news ID',
        data: null
      };
    }

    console.log(`Fetching news with ID ${id}...`);
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    console.log('News fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    
    // If backend is unavailable, return from in-memory data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      const newsItem = inMemoryNews.find(item => item._id === id);
      if (newsItem) {
        return {
          success: true,
          data: newsItem
        };
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch news',
      data: null
    };
  }
};

// Create news
export const createNews = async (newsData) => {
  try {
    if (!newsData) {
      return {
        success: false,
        message: 'No data provided'
      };
    }

    console.log('Creating news with data:', newsData);
    const response = await axiosInstance.post(API_ENDPOINT, newsData);
    console.log('News created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    
    // If backend is unavailable, simulate successful creation
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating news creation');
      
      const newId = Math.floor(Math.random() * 1000) + 10;
      const newNews = {
        _id: newId.toString(),
        ...newsData,
        createdAt: new Date().toISOString()
      };
      
      // Add to in-memory data
      inMemoryNews.unshift(newNews);
      
      return {
        success: true,
        data: newNews,
        message: 'News created successfully (Demo Mode)'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create news'
    };
  }
};

// Update news
export const updateNews = async (id, newsData) => {
  try {
    if (!id || !newsData) {
      return {
        success: false,
        message: !id ? 'Invalid news ID' : 'No data provided'
      };
    }

    console.log(`Updating news with ID ${id}:`, newsData);
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, newsData);
    console.log('News updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating news with ID ${id}:`, error);
    
    // If backend is unavailable, simulate successful update
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating news update');
      
      const index = inMemoryNews.findIndex(item => item._id === id);
      if (index !== -1) {
        const updatedNews = {
          ...inMemoryNews[index],
          ...newsData,
          updatedAt: new Date().toISOString()
        };
        
        inMemoryNews[index] = updatedNews;
        
        return {
          success: true,
          data: updatedNews,
          message: 'News updated successfully (Demo Mode)'
        };
      }
      
      return {
        success: false,
        message: 'News not found'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update news'
    };
  }
};

// Delete news
export const deleteNews = async (id) => {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Invalid news ID'
      };
    }

    console.log(`Deleting news with ID ${id}...`);
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    console.log('News deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting news with ID ${id}:`, error);
    
    // If backend is unavailable, simulate successful deletion
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating news deletion');
      
      const exists = inMemoryNews.some(item => item._id === id);
      if (!exists) {
        return {
          success: false,
          message: 'News not found'
        };
      }
      
      inMemoryNews = inMemoryNews.filter(item => item._id !== id);
      
      return {
        success: true,
        message: 'News deleted successfully (Demo Mode)'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete news'
    };
  }
}; 