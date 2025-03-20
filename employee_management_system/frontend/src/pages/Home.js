import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getNews } from '../services/newsService';
import NewsSlider from '../components/NewsSlider';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
  color: white;
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 6rem 1.5rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroText = styled.div`
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    
    @media (max-width: 768px) {
      font-size: 1.125rem;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: var(--secondary-color);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 2rem;
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: white;
    color: var(--primary-color);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const HeroImage = styled(motion.div)`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    border-radius: 12px;
    opacity: 0.3;
    z-index: -1;
    transform: rotate(-3deg);
  }
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 992px) {
    margin-top: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const AboutSection = styled.section`
  padding: 6rem 2rem;
  background-color: #f8f9fa;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AboutImage = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 992px) {
    order: 1;
  }
`;

const AboutText = styled.div`
  @media (max-width: 992px) {
    order: 2;
    text-align: center;
  }
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--dark-color);
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.125rem;
    color: var(--gray-color);
    margin-bottom: 1.5rem;
    line-height: 1.7;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
    
    li {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.75rem;
      font-size: 1.125rem;
      color: var(--dark-color);
      
      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
      }
    }
  }
`;

const NewsSection = styled.section`
  padding: 6rem 2rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.125rem;
    color: var(--gray-color);
    max-width: 700px;
    margin: 0 auto;
  }
`;

const NewsSliderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const NewsSliderTrack = styled(motion.div)`
  display: flex;
  gap: 2rem;
`;

const NewsCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  min-width: 350px;
  flex: 1;
  
  @media (max-width: 576px) {
    min-width: 280px;
  }
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }
  
  .date {
    font-size: 0.875rem;
    color: var(--gray-color);
    margin-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  a {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const SliderButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--light-gray-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CTASection = styled.section`
  background-color: var(--primary-color);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background-color: white;
  color: var(--primary-color);
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const AnimatedText = styled(motion.span)`
  display: block;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, #4361ee, #3a0ca3, #ffffff);
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s ease infinite;
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Home = () => {
  const words = ["Employees", "Teams", "Performance", "Success"];
  const [currentWord, setCurrentWord] = useState(0);
  const [currentNewsSlide, setCurrentNewsSlide] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);
  
  useEffect(() => {
    fetchNews();
  }, []);
  
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getNews();
      
      if (response.success) {
        setNewsItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const nextSlide = () => {
    if (newsItems.length > 0) {
      setCurrentNewsSlide((prev) => 
        prev === newsItems.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevSlide = () => {
    if (newsItems.length > 0) {
      setCurrentNewsSlide((prev) => 
        prev === 0 ? newsItems.length - 1 : prev - 1
      );
    }
  };
  
  return (
    <HomeContainer>
      <Header />
      
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroText>
              <h1>
                Transform Your
                <AnimatedText
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {words[currentWord]}
                </AnimatedText>
                Management
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                A powerful, intuitive platform designed to help you manage your workforce efficiently.
                From onboarding to performance tracking, we've got you covered.
              </motion.p>
              <HeroButtons>
                <PrimaryButton
                  to="/login"
                  as={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </PrimaryButton>
                <SecondaryButton
                  to="/signup"
                  as={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </SecondaryButton>
              </HeroButtons>
            </HeroText>
          </motion.div>
          
          <HeroImage
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3"
              alt="Employee Management Dashboard"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </HeroImage>
        </HeroContent>
      </HeroSection>
      
      <AboutSection>
        <AboutContent>
          <AboutImage>
            <motion.img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3"
              alt="About Our Company"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
          </AboutImage>
          
          <AboutText>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              About Our Company
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Founded in 2015, our company has been at the forefront of employee management innovation. 
              We believe that effective employee management is the cornerstone of successful businesses.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our mission is to provide organizations with the tools they need to streamline HR processes, 
              improve employee engagement, and drive business growth through effective workforce management.
            </motion.p>
            
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <li>Trusted by over 5,000 companies worldwide</li>
              <li>Award-winning customer support</li>
              <li>Continuous innovation and feature updates</li>
              <li>Secure, compliant, and reliable platform</li>
            </motion.ul>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <PrimaryButton 
                to="/signup"
                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
              >
                Join Us Today
              </PrimaryButton>
            </motion.div>
          </AboutText>
        </AboutContent>
      </AboutSection>
      
      <NewsSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: '2.5rem', color: 'var(--dark-color)', marginBottom: '1rem' }}>
            Company News
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--gray-color)' }}>
            Stay updated with the latest developments and announcements from our company.
          </p>
        </motion.div>
        <NewsSlider />
      </NewsSection>
      
      <CTASection>
        <CTAContent>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Employee Management?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of organizations that have streamlined their HR processes with our platform.
            Get started today and see the difference.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CTAButton to="/signup">Get Started Now</CTAButton>
          </motion.div>
        </CTAContent>
      </CTASection>
      
      <Footer />
    </HomeContainer>
  );
};

export default Home; 