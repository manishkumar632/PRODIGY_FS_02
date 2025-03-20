import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getUserMessages } from '../services/messageService';
import { useAuth } from '../context/AuthContext';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
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

const NewMessageButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MessageHeader = styled.div`
  padding: 1rem;
  background-color: ${props => props.hasReplies ? '#f0f7ff' : '#f9f9f9'};
  border-bottom: 1px solid var(--light-gray-color);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.1rem;
    margin: 0;
    color: var(--dark-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .status {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${props => props.hasReplies ? 'var(--primary-color)' : 'var(--gray-color)'};
    }
  }
  
  .meta {
    font-size: 0.8rem;
    color: var(--gray-color);
  }
`;

const MessageContent = styled.div`
  padding: 1rem;
  color: var(--dark-color);
  line-height: 1.6;
`;

const ReplyList = styled.div`
  padding: 0 1rem 1rem;
`;

const Reply = styled.div`
  background-color: ${props => props.isAdmin ? '#f0f7ff' : '#f9f9f9'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  .reply-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    .reply-author {
      font-weight: 500;
      color: ${props => props.isAdmin ? 'var(--primary-color)' : 'var(--dark-color)'};
    }
    
    .reply-date {
      font-size: 0.75rem;
      color: var(--gray-color);
    }
  }
  
  .reply-content {
    color: var(--dark-color);
    line-height: 1.5;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
    margin-bottom: 1.5rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid var(--primary-color);
    border-color: var(--primary-color) transparent var(--primary-color) transparent;
    animation: spinner 1.2s linear infinite;
  }
  
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const NotificationBadge = styled.span`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  line-height: 20px;
  text-align: center;
  margin-left: 0.5rem;
`;

const UserMessages = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user messages
  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!currentUser || !currentUser.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await getUserMessages(currentUser.id);
        
        if (response && response.success && Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          toast.error('Failed to load messages');
        }
      } catch (error) {
        console.error('Error fetching user messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserMessages();
  }, [currentUser]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Toggle message expansion
  const toggleMessageExpansion = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };
  
  // Count unread replies (replies from admin that the user hasn't seen yet)
  const getUnreadRepliesCount = (message) => {
    if (!message.replies || message.replies.length === 0) return 0;
    
    // Count admin replies
    return message.replies.filter(reply => reply.isAdmin).length;
  };
  
  // Check if a message has replies from admin
  const hasAdminReplies = (message) => {
    return message.replies && message.replies.some(reply => reply.isAdmin);
  };
  
  return (
    <Container>
      <Header>
        <h1>My Messages</h1>
        <NewMessageButton to="/contact">
          ✉️ New Message
        </NewMessageButton>
      </Header>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : messages.length === 0 ? (
        <EmptyState>
          <h3>No messages yet</h3>
          <p>You haven't sent any messages yet. Click the button above to send your first message.</p>
          <NewMessageButton to="/contact">
            ✉️ Send a Message
          </NewMessageButton>
        </EmptyState>
      ) : (
        <MessageList>
          <AnimatePresence>
            {messages.map(message => {
              const unreadReplies = getUnreadRepliesCount(message);
              return (
                <MessageCard 
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageHeader 
                    onClick={() => toggleMessageExpansion(message.id)}
                    hasReplies={hasAdminReplies(message)}
                  >
                    <h3>
                      <span className="status"></span>
                      {message.subject}
                      {unreadReplies > 0 && (
                        <NotificationBadge>{unreadReplies}</NotificationBadge>
                      )}
                    </h3>
                    <div className="meta">
                      {formatDate(message.createdAt)}
                    </div>
                  </MessageHeader>
                  
                  {expandedMessage === message.id && (
                    <>
                      <MessageContent>
                        {message.message}
                      </MessageContent>
                      
                      {message.replies && message.replies.length > 0 && (
                        <ReplyList>
                          {message.replies.map(reply => (
                            <Reply 
                              key={reply.id} 
                              isAdmin={reply.isAdmin}
                            >
                              <div className="reply-header">
                                <span className="reply-author">
                                  {reply.isAdmin ? 'Admin' : 'You'}
                                </span>
                                <span className="reply-date">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <div className="reply-content">
                                {reply.message}
                              </div>
                            </Reply>
                          ))}
                        </ReplyList>
                      )}
                    </>
                  )}
                </MessageCard>
              );
            })}
          </AnimatePresence>
        </MessageList>
      )}
    </Container>
  );
};

export default UserMessages; 