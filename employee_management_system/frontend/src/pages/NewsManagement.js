import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getNews, createNews, updateNews, deleteNews } from '../services/newsService';

// Styled Components
const NewsManagementContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin: 0;
  }
`;

const AddButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark-color);
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .image-container {
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }
  
  &:hover .image-container img {
    transform: scale(1.05);
  }
  
  .content {
    padding: 1.5rem;
    
    h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }
    
    .date {
      color: var(--gray-color);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    
    p {
      margin: 0;
      color: var(--dark-gray-color);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    padding: 0 1.5rem 1.5rem;
    gap: 0.5rem;
    
    button {
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      &.edit-btn {
        color: var(--primary-color);
      }
      
      &.delete-btn {
        color: var(--danger-color);
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
    color: var(--gray-color);
  }
`;

const Modal = styled(motion.div)`
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
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  background-color: var(--light-gray-color);
  color: var(--dark-color);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark-color);
  }
  
  &:disabled {
    background-color: var(--light-gray-color);
    cursor: not-allowed;
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
  padding: 1rem;
  
  .dialog-content {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1.5rem;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        
        &.cancel {
          background-color: var(--light-gray-color);
          color: var(--dark-color);
          
          &:hover {
            background-color: #e0e0e0;
          }
        }
        
        &.confirm {
          background-color: var(--danger-color);
          color: white;
          
          &:hover {
            background-color: #d32f2f;
          }
        }
      }
    }
  }
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  date: Yup.date().required('Date is required')
});

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getNews();
      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Submitting values:', values); // Debug log
      const newsData = {
        ...values,
        date: new Date(values.date).toISOString()
      };

      let response;
      if (editingNews) {
        response = await updateNews(editingNews._id, newsData);
      } else {
        response = await createNews(newsData);
      }

      if (response.success) {
        toast.success(editingNews ? 'News updated successfully' : 'News created successfully');
        fetchNews();
        handleCloseModal();
        resetForm();
      } else {
        toast.error(response.message || 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        const response = await deleteNews(id);
        if (response.success) {
          toast.success('News deleted successfully');
          fetchNews();
        } else {
          toast.error(response.message || 'Failed to delete news');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Failed to delete news');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const initialValues = editingNews ? {
    title: editingNews.title,
    content: editingNews.content,
    image: editingNews.image,
    date: new Date(editingNews.date).toISOString().split('T')[0]
  } : {
    title: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0]
  };

  return (
    <NewsManagementContainer>
      <PageHeader>
        <h1>News Management</h1>
        <AddButton
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add News
        </AddButton>
      </PageHeader>

      {loading ? (
        <EmptyState>
          <h3>Loading...</h3>
        </EmptyState>
      ) : news.length === 0 ? (
        <EmptyState>
          <h3>No News Available</h3>
          <p>Start by adding your first news item!</p>
          <AddButton
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add News
          </AddButton>
        </EmptyState>
      ) : (
        <NewsGrid>
          {news.map((item) => (
            <NewsCard key={item._id}>
              <div className="image-container">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="content">
                <h3>{item.title}</h3>
                <div className="date">{new Date(item.date).toLocaleDateString()}</div>
                <p>{item.content}</p>
              </div>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                  <FaTrash />
                </button>
              </div>
            </NewsCard>
          ))}
        </NewsGrid>
      )}

      {isModalOpen && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2>{editingNews ? 'Edit News' : 'Add News'}</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values }) => (
                <Form>
                  <FormGroup>
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" id="title" name="title" />
                    {errors.title && touched.title && (
                      <ErrorText>{errors.title}</ErrorText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="content">Content</Label>
                    <Field
                      as="textarea"
                      id="content"
                      name="content"
                      rows="6"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        minHeight: '150px',
                        resize: 'vertical'
                      }}
                    />
                    {errors.content && touched.content && (
                      <ErrorText>{errors.content}</ErrorText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="image">Image URL</Label>
                    <Input type="text" id="image" name="image" />
                    {errors.image && touched.image && (
                      <ErrorText>{errors.image}</ErrorText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" id="date" name="date" />
                    {errors.date && touched.date && (
                      <ErrorText>{errors.date}</ErrorText>
                    )}
                  </FormGroup>

                  <ModalActions>
                    <CancelButton type="button" onClick={handleCloseModal}>
                      Cancel
                    </CancelButton>
                    <SubmitButton
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? 'Saving...' : editingNews ? 'Update News' : 'Add News'}
                    </SubmitButton>
                  </ModalActions>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </Modal>
      )}
    </NewsManagementContainer>
  );
};

export default NewsManagement; 