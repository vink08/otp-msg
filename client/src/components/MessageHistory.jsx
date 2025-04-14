import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/MessageHistory.css';

const MessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  const fetchMessageHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch message history');
      }
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Extract OTP from message content if it's not directly available
  const extractOTP = (content) => {
    const match = content.match(/OTP is: (\d+)/);
    return match ? match[1] : null;
  };

  if (loading) return <div className="loading">Loading message history...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="message-history-container">
      <h2>Message History</h2>
      
      {messages.length === 0 ? (
        <p className="no-messages">No messages sent yet.</p>
      ) : (
        <div className="message-list">
          {messages.map((msg) => {
            // Try to extract OTP from message content if not already stored
            const otp = msg.otp || extractOTP(msg.content);
            
            return (
              <div key={msg.id} className="message-item">
                <div className="message-header">
                  <h3 onClick={() => navigate(`/contact/${msg.contactId}`)}>
                    {msg.contactName}
                  </h3>
                  <span className="message-time">{formatDate(msg.timestamp)}</span>
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
                {otp && (
                  <div className="message-otp">
                    <strong>OTP sent:</strong> {otp}
                  </div>
                )}
                <div className="message-status">
                  Status: {msg.status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessageHistory;