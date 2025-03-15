// routes/audit.js
const express = require('express');
const router = express.Router();

// Dummy in-memory audit logs
let auditLogs = [
  { id: 1, action: "New booking created", timestamp: new Date(), details: "Booking ID 1" },
  { id: 2, action: "Inventory item updated", timestamp: new Date(), details: "Item ID 1" }
];

router.get('/', (req, res) => {
  res.json(auditLogs);
});

module.exports = router;
