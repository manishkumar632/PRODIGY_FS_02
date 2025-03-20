import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getNews, deleteNews } from '../services/newsService';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.75rem;
    color: var(--dark-color);
    margin: 0;
  }
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const NewsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const NewsImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const NewsContent = styled.div`
  padding: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    margin: 0 0 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
    margin: 0 0 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .date {
    font-size: 0.875rem;
    color: var(--gray-color);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--light-gray-color);
  
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.edit-btn {
      background-color: rgba(67, 97, 238, 0.1);
      color: var(--primary-color);
      
      &:hover {
        background-color: var(--primary-color);
        color: white;
      }
    }
    
    &.delete-btn {
      background-color: rgba(231, 76, 60, 0.1);
      color: var(--danger-color);
      
      &:hover {
        background-color: var(--danger-color);
        color: white;
      }
    }
  }
`;

const ConfirmDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  .dialog-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    padding: 1.5rem;
    
    h3 {
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1.5rem;
      color: var(--gray-color);
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      
      button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        
        &.cancel {
          background-color: var(--light-gray-color);
          color: var(--dark-color);
        }
        
        &.confirm {
          background-color: var(--danger-color);
          color: white;
        }
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
    margin-bottom: 1.5rem;
  }
`;

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    newsId: null,
    newsTitle: ''
  });
  
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.isAdmin;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getNews();
      
      if (response.success) {
        setNews(response.data);
      } else {
        toast.error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, title) => {
    setConfirmDialog({
      isOpen: true,
      newsId: id,
      newsTitle: title
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const { newsId } = confirmDialog;
      
      if (!newsId) {
        toast.error('Invalid news ID');
        return;
      }
      
      const response = await deleteNews(newsId);
      
      if (response.success) {
        setNews(prevNews => prevNews.filter(item => item._id !== newsId));
        toast.success('News deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete news');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news');
    } finally {
      setConfirmDialog({
        isOpen: false,
        newsId: null,
        newsTitle: ''
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      newsId: null,
      newsTitle: ''
    });
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>News & Updates</h1>
        {isAdmin && (
          <AddButton to="/news/add">
            <FaPlus /> Add News
          </AddButton>
        )}
      </Header>

      {news.length > 0 ? (
        <NewsGrid>
          {news.map(item => (
            <NewsCard key={item._id}>
              <NewsImage src={item.image} />
              <NewsContent>
                <h2>{item.title}</h2>
                <p>{item.content}</p>
                <div className="date">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </NewsContent>
              {isAdmin && (
                <ActionButtons>
                  <Link
                    to={`/news/edit/${item._id}`}
                    className="edit-btn"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(item._id, item.title)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </ActionButtons>
              )}
            </NewsCard>
          ))}
        </NewsGrid>
      ) : (
        <EmptyState>
          <h3>No News Available</h3>
          <p>There are no news items to display at the moment.</p>
          {isAdmin && (
            <AddButton to="/news/add">
              <FaPlus /> Add Your First News
            </AddButton>
          )}
        </EmptyState>
      )}

      {confirmDialog.isOpen && (
        <ConfirmDialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="dialog-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{confirmDialog.newsTitle}"? This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button className="cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="confirm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </motion.div>
        </ConfirmDialog>
      )}
    </Container>
  );
};

export default NewsList; 