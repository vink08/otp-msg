# Message App with Vonage OTP

A React + Vite application with Express backend for sending OTP messages via Vonage.

## Project Structure

- `client/` - React frontend built with Vite
- `server.js` - Express backend with Vonage integration

## Local Development

### Backend

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

### Frontend

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following environment variables:
   - `VONAGE_API_KEY`
   - `VONAGE_API_SECRET`
4. Deploy the service

### Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy the project

## Environment Variables

### Backend

- `PORT` - Server port (default: 5000)
- `VONAGE_API_KEY` - Your Vonage API Key
- `VONAGE_API_SECRET` - Your Vonage API Secret

## API Endpoints

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a single contact
- `GET /api/messages` - Get all messages
- `POST /api/send-message` - Send a message with OTP
- `POST /api/verify-otp` - Verify an OTP 