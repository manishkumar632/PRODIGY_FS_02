import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  getAllMessages, 
  getMessageById, 
  updateMessageStatus, 
  addReply, 
  deleteMessage 
} from '../services/messageService';

// Styled Components
const Container = styled.div`
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
    font-size: 1.8rem;
    color: var(--dark-color);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--dark-color)'};
  border: 1px solid var(--light-gray-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--secondary-color)' : 'var(--light-gray-color)'};
  }
`;

const MessageList = styled.div`
  display: grid;
  gap: 1rem;
`;

const MessageCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.unread ? 'rgba(67, 97, 238, 0.1)' : 'white'};
  cursor: pointer;
  
  h3 {
    font-size: 1.1rem;
    margin: 0;
    color: var(--dark-color);
    font-weight: ${props => props.unread ? '600' : '500'};
  }
  
  .message-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    span {
      font-size: 0.9rem;
      color: var(--gray-color);
    }
  }
`;

const MessageContent = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--light-gray-color);
  
  p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }
  
  .message-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--gray-color);
  }
`;

const ReplySection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--light-gray-color);
`;

const ReplyList = styled.div`
  margin-bottom: 1rem;
`;

const Reply = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.isAdmin ? 'rgba(67, 97, 238, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  p {
    margin: 0;
  }
  
  .reply-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--gray-color);
    margin-top: 0.5rem;
  }
`;

const ReplyForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--light-gray-color);
    border-radius: 4px;
    resize: vertical;
    min-height: 100px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  button {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--secondary-color);
    }
    
    &:disabled {
      background-color: var(--gray-color);
      cursor: not-allowed;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.mark-read {
      background-color: var(--success-color);
      color: white;
      
      &:hover {
        background-color: #218838;
      }
    }
    
    &.mark-unread {
      background-color: var(--warning-color);
      color: white;
      
      &:hover {
        background-color: #e0a800;
      }
    }
    
    &.delete {
      background-color: var(--danger-color);
      color: white;
      
      &:hover {
        background-color: #c82333;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--gray-color);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  
  h3 {
    font-size: 1.2rem;
    color: var(--gray-color);
  }
`;

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

const AdminMessages = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch messages based on filter
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getAllMessages(filter !== 'all' ? filter : '');
      
      if (response.success) {
        setMessages(response.data);
      } else {
        toast.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [filter]);
  
  // Toggle message expansion
  const toggleMessageExpansion = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    setReplyText('');
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
        isAdmin: true,
        adminId: currentUser.id
      };
      
      const response = await addReply(messageId, replyData);
      
      if (response.success) {
        toast.success('Reply sent successfully');
        setReplyText('');
        fetchMessages();
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
  
  // Handle message status update
  const handleStatusUpdate = async (messageId, status) => {
    try {
      const response = await updateMessageStatus(messageId, status);
      
      if (response.success) {
        toast.success(`Message marked as ${status}`);
        fetchMessages();
      } else {
        toast.error('Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
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
        setExpandedMessage(null);
        fetchMessages();
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
        <h1>Message Management</h1>
        <FilterContainer>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={filter === 'unread'} 
            onClick={() => setFilter('unread')}
          >
            Unread
          </FilterButton>
          <FilterButton 
            active={filter === 'read'} 
            onClick={() => setFilter('read')}
          >
            Read
          </FilterButton>
        </FilterContainer>
      </Header>
      
      {loading ? (
        <LoadingState>
          <h3>Loading messages...</h3>
        </LoadingState>
      ) : messages.length === 0 ? (
        <EmptyState>
          <h3>No messages found</h3>
          <p>There are no messages matching your current filter.</p>
        </EmptyState>
      ) : (
        <MessageList>
          {messages.map(message => (
            <MessageCard
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageHeader 
                unread={message.status === 'unread'}
                onClick={() => toggleMessageExpansion(message._id)}
              >
                <h3>{message.subject}</h3>
                <div className="message-meta">
                  <span>{message.name} ({message.email})</span>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              </MessageHeader>
              
              {expandedMessage === message._id && (
                <MessageContent>
                  <div className="message-info">
                    <span>From: {message.name} ({message.email})</span>
                    <span>Date: {formatDate(message.createdAt)}</span>
                  </div>
                  <p>{message.message}</p>
                  
                  <ReplySection>
                    {message.replies && message.replies.length > 0 && (
                      <ReplyList>
                        {message.replies.map((reply, index) => (
                          <Reply key={index} isAdmin={reply.isAdmin}>
                            <p>{reply.message}</p>
                            <div className="reply-meta">
                              <span>{reply.isAdmin ? 'Admin' : 'User'}</span>
                              <span>{formatDate(reply.createdAt)}</span>
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
                        {submitting ? 'Sending...' : 'Send Reply'}
                      </button>
                    </ReplyForm>
                  </ReplySection>
                  
                  <ActionButtons>
                    {message.status === 'unread' ? (
                      <button 
                        className="mark-read"
                        onClick={() => handleStatusUpdate(message._id, 'read')}
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <button 
                        className="mark-unread"
                        onClick={() => handleStatusUpdate(message._id, 'unread')}
                      >
                        Mark as Unread
                      </button>
                    )}
                    <button 
                      className="delete"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </button>
                  </ActionButtons>
                </MessageContent>
              )}
            </MessageCard>
          ))}
        </MessageList>
      )}
    </Container>
  );
};

export default AdminMessages; 