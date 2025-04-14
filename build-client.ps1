# Build the client application
Write-Host "Building client application..."
cd client
npm install
npm run build
cd ..

Write-Host "Client application built successfully!"
Write-Host "You can now start the server with: node server.js" 