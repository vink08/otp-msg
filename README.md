# Message App with Vonage OTP

A React + Vite application with Express backend for sending OTP messages via Vonage.

# OTP Message Service

A secure and user-friendly OTP (One-Time Password) messaging service built with Node.js and Express, featuring Vonage SMS integration for reliable message delivery.

## Live Demo
[Live Demo URL](https://otp-msg.vercel.app/)

Backend Deployed 
[Live Demo URL](https://otp-msg.onrender.com)

## Features
- Secure OTP generation and validation
- SMS delivery using Vonage API
- Clean and responsive user interface
- Real-time OTP status updates
- Rate limiting for API endpoints
- Environment-based configuration
- Cross-platform compatibility

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Vonage SDK** - SMS delivery service
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - API rate limiting

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript** - Client-side functionality
- **Bootstrap** - Responsive design framework

## Architecture & Design Decisions

### 1. Security Considerations
- Environment variables for sensitive data
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure OTP generation using crypto module

### 2. Code Organization
- Separation of concerns (client/server)
- Modular architecture
- Clear file structure
- Consistent coding style

### 3. User Experience
- Responsive design for all devices
- Clear error messages
- Loading states for better feedback
- Intuitive interface

### 4. Performance
- Static file serving
- Efficient API endpoints
- Minimal dependencies
- Optimized build process

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/vink08/otp-msg.git
cd otp-msg
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_FROM_NUMBER=your_vonage_number
PORT=10000
```

4. Build the client:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:10000`


## API Endpoints

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a single contact
- `GET /api/messages` - Get all messages
- `POST /api/send-message` - Send a message with OTP
- `POST /api/verify-otp` - Verify an OTP 

### Send OTP
- **POST** `/api/send-otp`
- Body: `{ "phone": "phone_number" }`
- Response: `{ "success": true, "message": "OTP sent successfully" }`

### Verify OTP
- **POST** `/api/verify-otp`
- Body: `{ "phone": "phone_number", "otp": "123456" }`
- Response: `{ "success": true, "message": "OTP verified successfully" }`

## Development

### Scripts
- `npm start` - Start the server
- `npm run build` - Build the client
- `npm run dev` - Start in development mode with auto-reload

### Building for Production
1. Update environment variables for production
2. Build the client: `npm run build`
3. Start the server: `npm start`

## Best Practices Implemented

1. **Error Handling**
   - Comprehensive error catching
   - Meaningful error messages
   - Proper HTTP status codes

2. **Code Quality**
   - Consistent formatting
   - Clear variable naming
   - Proper commenting
   - Modular code structure

3. **Security**
   - Environment variable usage
   - Input validation
   - Rate limiting
   - CORS configuration

4. **Performance**
   - Efficient API design
   - Optimized static file serving
   - Minimal dependencies

## Future Improvements

1. Add user authentication
2. Implement OTP expiration
3. Add support for email OTP
4. Implement retry mechanism for failed SMS
5. Add analytics dashboard
6. Implement webhook support

## License
MIT License

## Author
Vinay Kumar

