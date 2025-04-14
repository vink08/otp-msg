// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';
import ComposeMessage from './components/ComposeMessage';
import MessageHistory from './components/MessageHistory';

function App() {
  const [activeMenu, setActiveMenu] = useState('contacts');

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Contacts App</h1>
          <nav className="main-nav">
            <ul>
              <li>
                <button 
                  className={activeMenu === 'contacts' ? 'active' : ''} 
                  onClick={() => setActiveMenu('contacts')}
                >
                  <Link to="/">Contacts</Link>
                </button>
              </li>
              <li>
                <button 
                  className={activeMenu === 'messages' ? 'active' : ''} 
                  onClick={() => setActiveMenu('messages')}
                >
                  <Link to="/messages">Message History</Link>
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<ContactList />} />
            <Route path="/contact/:id" element={<ContactDetails />} />
            <Route path="/compose/:id" element={<ComposeMessage />} />
            <Route path="/messages" element={<MessageHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;