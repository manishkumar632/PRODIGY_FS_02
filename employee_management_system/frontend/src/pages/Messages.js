import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getUserMessages, markRepliesAsRead, addReply, deleteMessage } from '../services/messageService';
import { useAuth } from '../context/AuthContext';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
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

const ReplyForm = styled.form`
  padding: 0 1rem 1rem;
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--light-gray-color);
    border-radius: 4px;
    min-height: 100px;
    resize: vertical;
    margin-bottom: 0.5rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    }
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    float: right;
    
    &:hover {
      background-color: var(--secondary-color);
    }
    
    &:disabled {
      background-color: var(--gray-color);
      cursor: not-allowed;
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    
    &.delete {
      background-color: var(--danger-color);
      color: white;
      
      &:hover {
        background-color: #c82333;
      }
    }
  }
`;

const Messages = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch user messages
  useEffect(() => {
    const fetchMessages = async () => {
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
    
    fetchMessages();
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
  const toggleMessageExpansion = async (messageId) => {
    // If we're expanding a message that has new replies, mark them as read
    if (expandedMessage !== messageId) {
      const message = messages.find(m => m._id === messageId);
      if (message && message.hasNewReplies) {
        try {
          await markRepliesAsRead(messageId);
          
          // Update the local state to reflect that replies have been read
          setMessages(messages.map(m => 
            m._id === messageId ? { ...m, hasNewReplies: false } : m
          ));
        } catch (error) {
          console.error('Error marking replies as read:', error);
        }
      }
    }
    
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    setReplyText('');
  };
  
  // Count unread replies (replies from admin that the user hasn't seen yet)
  const getUnreadRepliesCount = (message) => {
    if (!message.replies || message.replies.length === 0) return 0;
    
    // Count admin replies that are unread
    return message.replies.filter(reply => reply.isAdmin && !reply.isRead).length;
  };
  
  // Check if a message has replies from admin
  const hasAdminReplies = (message) => {
    return message.replies && message.replies.some(reply => reply.isAdmin);
  };
  
  // Handle reply submission
  const handleReplySubmit = async (e, messageId) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const replyData = {
        message: replyText.trim(),
        isAdmin: false
      };
      
      const response = await addReply(messageId, replyData);
      
      if (response.success) {
        toast.success('Reply sent successfully');
        setReplyText('');
        
        // Update the local state to include the new reply
        setMessages(messages.map(m => 
          m._id === messageId ? {
            ...m,
            replies: [...(m.replies || []), {
              ...replyData,
              createdAt: new Date().toISOString(),
              isRead: true
            }]
          } : m
        ));
      } else {
        toast.error('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const response = await deleteMessage(messageId);
      
      if (response.success) {
        toast.success('Message deleted successfully');
        
        // Remove the deleted message from the local state
        setMessages(messages.filter(m => m._id !== messageId));
        setExpandedMessage(null);
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
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
          {messages.map(message => {
            const unreadReplies = getUnreadRepliesCount(message);
            return (
              <MessageCard
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageHeader
                  onClick={() => toggleMessageExpansion(message._id)}
                  hasReplies={hasAdminReplies(message)}
                >
                  <h3>
                    <span className="status"></span>
                    {message.subject}
                    {unreadReplies > 0 && (
                      <NotificationBadge>{unreadReplies}</NotificationBadge>
                    )}
                  </h3>
                  <span className="meta">
                    {formatDate(message.createdAt)}
                  </span>
                </MessageHeader>
                
                <AnimatePresence>
                  {expandedMessage === message._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MessageContent>
                        {message.message}
                      </MessageContent>
                      
                      {message.replies && message.replies.length > 0 && (
                        <ReplyList>
                          {message.replies.map((reply, index) => (
                            <Reply key={index} isAdmin={reply.isAdmin}>
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
                      
                      <ReplyForm onSubmit={(e) => handleReplySubmit(e, message._id)}>
                        <textarea
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          required
                        />
                        <button type="submit" disabled={submitting}>
                          {submitting ? 'Sending...' : 'Reply'}
                        </button>
                      </ReplyForm>
                      
                      <ActionButtons>
                        <button
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message._id);
                          }}
                        >
                          Delete Message
                        </button>
                      </ActionButtons>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MessageCard>
            );
          })}
        </MessageList>
      )}
    </Container>
  );
};

export default Messages; 