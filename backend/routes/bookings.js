// routes/bookings.js
const express = require('express');
const router = express.Router();

// Dummy in-memory inventory data for demonstration.
// Key format: "cameraModel-lensType" (e.g., "A70-95")
let dummyInventory = {
  'A70-95': 50, // Example: 5 kits available for camera model A70 with a 95° lens
};

// Dummy in-memory bookings store
let bookings = [];
let nextBookingId = 1;

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

    // Compute endDate based on duration
    let endDate;
    const durationLower = duration.toLowerCase();
    if (durationLower.includes('night')) {
      const nights = parseInt(duration);
      if (!isNaN(nights)) {
        let start = new Date(date);
        let end = new Date(start);
        end.setDate(start.getDate() + nights - 1);
        endDate = end.toISOString().slice(0, 10);
      } else {
        endDate = date;
      }
    } else if (durationLower.includes('rental') || durationLower.includes('month')) {
      // Example: "6-month rental" will add 6 months and subtract one day.
      const months = parseInt(duration);
      if (!isNaN(months)) {
        let start = new Date(date);
        let end = new Date(start);
        end.setMonth(start.getMonth() + months);
        end.setDate(end.getDate() - 1);
        endDate = end.toISOString().slice(0, 10);
      } else {
        endDate = date;
      }
    } else {
      endDate = date;
    }
  
  // Create booking object including the computed endDate
  const booking = {
    id: nextBookingId++,
    date,
    duration,
    endDate,
    cameraModel,
    lensType,
    quantity,
    customerEmail,
    status: 'Confirmed'
  };

  // Log booking (in memory)
  bookings.push(booking);


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

// GET /api/bookings - List all bookings
router.get('/', (req, res) => {
    res.json(bookings);
  });
  

/**
 * PUT /api/bookings/:id/cancel
 * Cancel an existing booking.
 */
router.put('/:id/cancel', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
  
    // Update booking status to "Cancelled"
    booking.status = 'Cancelled';
  
    // Optionally, increase the inventory count back
    const key = `${booking.cameraModel}-${booking.lensType}`;
    dummyInventory[key] = (dummyInventory[key] || 0) + booking.quantity;
  
    // Simulate alternative dates suggestion (for demonstration)
    const alternativeDates = [
      "2025-04-25",
      "2025-04-26",
      "2025-04-27"
    ];
  
    // Simulate sending cancellation email and audit logging here
  
    return res.status(200).json({
      message: 'Booking cancelled',
      booking,
      alternativeDates,
    });
  });
  
  /**
   * PUT /api/bookings/:id/rearrange
   * Rearrange an existing booking.
   */

  router.put('/:id/rearrange', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
  
    // Extract new booking details from request body (e.g., new date and/or duration)
    const { newDate, newDuration } = req.body;
    if (!newDate || !newDuration) {
      return res.status(400).json({ error: 'Missing new booking details' });
    }
  
    // For simplicity, we'll update only the date and duration.
    booking.date = newDate;
    booking.duration = newDuration;

      // Update the booking status to "Confirmed" to reactivate it
  booking.status = 'Confirmed';
    
    // Simulate sending rearrangement email and audit logging here
  
    return res.status(200).json({
      message: 'Booking rearranged',
      booking
    });
  });

module.exports = router;
