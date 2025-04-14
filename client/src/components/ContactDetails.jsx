import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/ContactDetails.css';

const ContactDetails = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContactDetails();
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contacts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact details');
      }
      const data = await response.json();
      setContact(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    navigate(`/compose/${id}`);
  };

  if (loading) return <div className="loading">Loading contact details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!contact) return <div className="not-found">Contact not found</div>;

  return (
    <div className="contact-details-container">
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Contacts
      </button>
      
      <div className="contact-profile">
        <div className="contact-avatar-large">
          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
        </div>
        <h2>{contact.firstName} {contact.lastName}</h2>
        <div className="contact-info-details">
          <div className="info-item">
            <span className="label">Phone:</span>
            <span className="value">{contact.phone}</span>
          </div>
          {contact.email && (
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{contact.email}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="action-buttons">
        <button className="send-message-btn" onClick={handleSendMessage}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ContactDetails;