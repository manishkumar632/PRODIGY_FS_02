import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getNewsById, createNews, updateNews } from '../services/newsService';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const FormHeader = styled.div`
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--dark-color);
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--light-gray-color);
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    }
  }
  
  textarea {
    min-height: 150px;
    resize: vertical;
  }
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.secondary ? 'var(--light-gray-color)' : 'var(--primary-color)'};
  color: ${props => props.secondary ? 'var(--dark-color)' : 'white'};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.secondary ? '#e0e0e0' : 'var(--secondary-color)'};
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    content: ''
  });

  useEffect(() => {
    const fetchNews = async () => {
      if (isEditMode && id) {
        try {
          setIsLoading(true);
          const response = await getNewsById(id);
          
          if (response && response.success && response.data) {
            const news = response.data;
            setInitialValues({
              title: news.title || '',
              date: news.date ? new Date(news.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              image: news.image || '',
              content: news.content || ''
            });
          } else {
            toast.error('Failed to fetch news data');
            navigate('/news');
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          toast.error('Failed to fetch news data');
          navigate('/news');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNews();
  }, [id, isEditMode, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    date: Yup.date().required('Date is required'),
    image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
    content: Yup.string().required('Content is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!currentUser?.isAdmin) {
        toast.error('Only admin users can create/edit news');
        return;
      }

      const newsData = {
        ...values,
        createdBy: currentUser._id
      };

      const response = isEditMode
        ? await updateNews(id, newsData)
        : await createNews(newsData);

      if (response && response.success) {
        toast.success(isEditMode ? 'News updated successfully' : 'News created successfully');
        navigate('/news');
      } else {
        toast.error(response?.message || 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error(error.message || 'Failed to save news');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <FormContainer>
        <FormHeader>
          <h1>{isEditMode ? 'Edit News' : 'Create News'}</h1>
        </FormHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter news title"
                />
                <ErrorMessage name="title" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <label htmlFor="date">Date</label>
                <Field
                  type="date"
                  id="date"
                  name="date"
                />
                <ErrorMessage name="date" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <label htmlFor="image">Image URL</label>
                <Field
                  type="text"
                  id="image"
                  name="image"
                  placeholder="Enter image URL"
                />
                <ErrorMessage name="image" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <label htmlFor="content">Content</label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  placeholder="Enter news content"
                />
                <ErrorMessage name="content" component={ErrorText} />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" secondary onClick={() => navigate('/news')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update News' : 'Create News'}
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </Container>
  );
};

export default NewsForm; 