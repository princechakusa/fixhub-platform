require('dotenv').config();
const app = require('./src/app');
const http = require('http');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  // Use backticks (`) for template literals to include the PORT variable
  console.log(`Server running on port ${PORT}`);
});