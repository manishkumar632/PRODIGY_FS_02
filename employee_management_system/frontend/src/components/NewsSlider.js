import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getNews } from '../services/newsService';
import { motion } from 'framer-motion';

const SliderContainer = styled.div`
  margin: 4rem auto;
  padding: 3rem 2rem;
  max-width: 1200px;
  background-color: var(--light-bg-color, #f8f9fa);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: 2rem 1rem;
  }
`;

const SliderHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: clamp(2rem, 4vw, 2.5rem);
    color: var(--dark-color);
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    color: var(--gray-color);
    font-size: clamp(1rem, 2vw, 1.1rem);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const SlideItem = styled(motion.div)`
  padding: 1rem;
  height: 100%;
`;

const NewsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 400px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    height: 450px;
  }
`;

const NewsImage = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const NewsContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: clamp(1.1rem, 2vw, 1.25rem);
    font-weight: 600;
    margin: 0 0 0.75rem;
    color: var(--dark-color);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  p {
    color: var(--gray-color);
    margin: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.6;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
  }
  
  .date {
    font-size: 0.875rem;
    color: var(--primary-color);
    margin-top: 1rem;
    font-weight: 500;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &:after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
    font-size: 1.1rem;
  }
`;

const StyledSlider = styled(Slider)`
  .slick-track {
    display: flex !important;
    align-items: stretch;
    gap: 1rem;
  }
  
  .slick-slide {
    height: inherit !important;
    > div {
      height: 100%;
    }
  }
  
  .slick-dots {
    bottom: -2.5rem;
    
    li button:before {
      font-size: 10px;
      color: var(--primary-color);
      opacity: 0.3;
    }
    
    li.slick-active button:before {
      opacity: 1;
    }
  }
  
  .slick-prev, .slick-next {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--primary-color);
      &:before {
        color: white;
      }
    }
    
    &:before {
      color: var(--primary-color);
      font-size: 20px;
      transition: color 0.3s ease;
    }
  }
  
  .slick-prev {
    left: -20px;
  }
  
  .slick-next {
    right: -20px;
  }
  
  @media (max-width: 768px) {
    .slick-prev, .slick-next {
      display: none !important;
    }
  }
`;

const NewsSlider = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNews();
      
      if (response.success && Array.isArray(response.data)) {
        setNews(response.data);
      } else {
        setNews([]);
        setError('Failed to load news data');
        console.error('Invalid news data format:', response);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: news.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: news.length > 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          infinite: news.length > 1
        }
      }
    ]
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <SliderContainer>
        <LoadingSpinner />
      </SliderContainer>
    );
  }

  if (error) {
    return (
      <SliderContainer>
        <EmptyState>
          <h3>Error Loading News</h3>
          <p>{error}</p>
        </EmptyState>
      </SliderContainer>
    );
  }

  if (!Array.isArray(news) || news.length === 0) {
    return (
      <SliderContainer>
        <EmptyState>
          <h3>No News Available</h3>
          <p>Stay tuned for updates!</p>
        </EmptyState>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer>
      <StyledSlider {...settings}>
        {news.map(item => (
          <SlideItem
            key={item._id || item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NewsCard>
              <NewsImage>
                <img 
                  src={item.image || 'https://via.placeholder.com/400x200'} 
                  alt={item.title || 'News image'} 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200';
                  }}
                />
              </NewsImage>
              <NewsContent>
                <h3>{item.title || 'Untitled'}</h3>
                <p>{item.content || 'No content available'}</p>
                <div className="date">
                  {item.date ? formatDate(item.date) : 'Date not available'}
                </div>
              </NewsContent>
            </NewsCard>
          </SlideItem>
        ))}
      </StyledSlider>
    </SliderContainer>
  );
};

export default NewsSlider; 