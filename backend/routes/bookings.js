// routes/bookings.js
const express = require('express');
const router = express.Router();

// Dummy in-memory inventory data for demonstration.
// Key format: "cameraModel-lensType" (e.g., "A70-95")
let dummyInventory = {
  'A70-95': 5, // Example: 5 kits available for camera model A70 with a 95° lens
};

router.post('/', (req, res) => {
  // Destructure booking details from request body
  const { date, duration, cameraModel, lensType, quantity, customerEmail } = req.body;

  // Validate required booking input
  if (!date || !duration || !cameraModel || !lensType || !quantity || !customerEmail) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  // Check inventory availability
  const key = `${cameraModel}-${lensType}`;
  const availableStock = dummyInventory[key] || 0;
  if (quantity > availableStock) {
    return res.status(400).json({ error: 'Insufficient stock available' });
  }

  // Reserve stock: decrement the dummy inventory
  dummyInventory[key] -= quantity;

  // Simulate logging the booking in Google Sheets
  // (In the future, replace this with a call to logBooking(bookingDetails))
  
  // Simulate sending a booking confirmation email
  // (In the future, replace this with sendEmail("bookingConfirmation", customerEmail, bookingDetails))
  
  // Simulate logging the audit event
  // (In the future, replace this with logAudit("New booking created", null, bookingDetails))

  // Return success response with booking details and remaining stock info
  return res.status(200).json({
    message: 'Booking confirmed',
    booking: { date, duration, cameraModel, lensType, quantity, customerEmail },
    remainingStock: dummyInventory[key],
  });
});

module.exports = router;
