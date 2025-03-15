const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Set up session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a secure key (and store it in .env for production)
    resave: false,
    saveUninitialized: false,
  }));

// Import and mount the bookings route
const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);

// Import and mount the inventory route
const inventoryRouter = require('./routes/inventory');
app.use('/api/inventory', inventoryRouter);

// Import and mount the admin routes
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

// server.js (snippet)
const auditRouter = require('./routes/audit');
app.use('/api/audit', auditRouter);

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
