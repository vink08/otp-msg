import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/ComposeMessage.css';

const ComposeMessage = () => {
  const [contact, setContact] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContactDetails();
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      const response = await fetch(`/api/contacts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact details');
      }
      const data = await response.json();
      setContact(data);
      setMessage("Hi. Your verification code will be sent to your phone."); // Default message
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    
    try {
      setSending(true);
      setError(null);
      
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: id,
          message: message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to send message');
      }
      
      setSuccess(true);
      setSending(false);
      setTimeout(() => {
        navigate('/messages');
      }, 2000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      setSending(false);
    }
  };

  if (!contact) return <div className="loading">Loading...</div>;

  return (
    <div className="compose-container">
      <button className="back-button" onClick={() => navigate(`/contact/${id}`)}>
        Back to Contact
      </button>
      
      <h2>Send Message to {contact.firstName} {contact.lastName}</h2>
      <p className="recipient-info">Recipient: {contact.phone}</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Verification code sent successfully!</div>}
      
      <form onSubmit={handleSendMessage} className="message-form">
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            disabled={sending}
            required
          />
          <p className="form-hint">A 6-digit OTP will be automatically generated and added to this message.</p>
        </div>
        
        <button 
          type="submit" 
          className="send-button"
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>
    </div>
  );
};

export default ComposeMessage;