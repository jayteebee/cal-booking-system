const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Import and mount the bookings route
const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
