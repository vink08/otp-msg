import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleContactClick = (id) => {
    navigate(`/contact/${id}`);
  };

  if (loading) return <div className="loading">Loading contacts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="contact-list-container">
      <h2>Contact List</h2>
      <div className="contact-list">
        {contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="contact-card"
              onClick={() => handleContactClick(contact.id)}
            >
              <div className="contact-avatar">
                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
              </div>
              <div className="contact-info">
                <h3>{contact.firstName} {contact.lastName}</h3>
                <p>{contact.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactList;