// routes/admin.js
const express = require('express');
const router = express.Router();
require('dotenv').config();

// ADMIN_AUTH environment variable is expected in the format "username:password"
const adminAuth = process.env.ADMIN_AUTH || 'admin:admin123';
const [adminUsername, adminPassword] = adminAuth.split(':');

/**
 * POST /api/admin/login
 * Admin login endpoint.
 * Expects JSON body with { "username": "admin", "password": "admin123" }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && password === adminPassword) {
    // Create an admin session by setting a property on req.session
    req.session.admin = { username };
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

/**
 * GET /api/admin/logout
 * Admin logout endpoint.
 * Destroys the admin session.
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
