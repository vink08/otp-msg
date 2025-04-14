
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 10000;

// Vonage Configuration - Using older Nexmo package for better compatibility
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: "acb15941",
  apiSecret: "dBitrzJ4K3eWwmxB"
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist'))); // Note: Vite builds to 'dist' not 'build'

// In-memory data store
let contacts = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    email: 'john.doe@example.com'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1987654321',
    email: 'jane.smith@example.com'
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    phone: '+1122334455',
    email: 'alice.johnson@example.com'
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Brown',
    phone: '+919810153260',
    email: 'bob.brown@example.com'
  },
  {
    id: '5',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '+918397862950', // Replace with your test number
    email: 'emily.davis@example.com'
  }
];

let messages = [];

// API Routes
// Get all contacts
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

// Get a single contact
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === req.params.id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

// Get all messages (sorted by time, descending)
app.get('/api/messages', (req, res) => {
  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(sortedMessages);
});

// Send a message with OTP using Vonage/Nexmo
app.post('/api/send-message', async (req, res) => {
  try {
    const { contactId, message } = req.body;
    
    // Validate input
    if (!contactId || !message) {
      return res.status(400).json({ error: 'Contact ID and message are required' });
    }
    
    // Find contact
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create message with OTP
    const messageWithOTP = `Hi. Your OTP is: ${otp}`;
    
    // Format phone number (Vonage requires E.164 format)
    let phoneNumber = contact.phone;
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }
    
    try {
      console.log('Attempting to send SMS to:', phoneNumber);
      
      // Send SMS via Nexmo using promises
      const response = await new Promise((resolve, reject) => {
        nexmo.message.sendSms(
          'CONTACTS APP', // This is the sender name, can be changed
          phoneNumber,
          messageWithOTP,
          { type: 'unicode' },
          (err, responseData) => {
            if (err) {
              reject(err);
            } else {
              resolve(responseData);
            }
          }
        );
      });
      
      console.log('Vonage/Nexmo response:', response);
      
      // Check if the message was sent successfully
      if (response.messages && response.messages[0] && response.messages[0]['status'] === "0") {
        console.log("Message sent successfully.");
        
        // Create message record
        const newMessage = {
          id: uuidv4(),
          contactId,
          contactName: `${contact.firstName} ${contact.lastName}`,
          content: messageWithOTP,
          otp: otp, // Store the OTP
          timestamp: new Date().toISOString(),
          status: 'sent',
          recipient: phoneNumber,
          messageId: response.messages[0]['message-id']
        };
        
        // Add to messages store
        messages.push(newMessage);
        
        // Return success response
        return res.status(200).json({ 
          success: true, 
          message: 'SMS sent successfully',
          messageId: newMessage.id,
          otp: otp
        });
      } else {
        const errorText = response.messages && response.messages[0] ? 
          response.messages[0]['error-text'] : 'Unknown error';
        
        console.log(`Message failed with error: ${errorText}`);
        return res.status(500).json({ 
          error: 'Failed to send SMS via Vonage/Nexmo',
          details: errorText
        });
      }
    } catch (vonageError) {
      console.error('Vonage/Nexmo error details:', vonageError);
      return res.status(500).json({ 
        error: 'Failed to send SMS via Vonage/Nexmo',
        details: vonageError.message || 'Unknown error'
      });
    }
    
  } catch (error) {
    console.error('General error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Verify OTP endpoint (manual verification since we're generating our own OTP)
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and verification code are required' });
    }
    
    // Format phone number to ensure consistency
    let phoneNumber = phone;
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }
    
    // Check if this is one of our contacts
    const contact = contacts.find(c => c.phone === phoneNumber);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    // Find the most recent message for this phone number
    const recentMessages = [...messages]
      .filter(m => m.recipient === phoneNumber)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (recentMessages.length === 0) {
      return res.status(404).json({ error: 'No verification code sent to this number' });
    }
    
    const latestMessage = recentMessages[0];
    
    // Verify the OTP
    if (latestMessage.otp === code) {
      return res.status(200).json({ 
        success: true, 
        message: 'Verification successful',
        status: 'approved'
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code',
        status: 'failed'
      });
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
});

// Fallback route for SPA
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
  
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
