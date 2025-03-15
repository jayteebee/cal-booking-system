// routes/bookings.js
const express = require('express');
const router = express.Router();
const { getInventoryData, updateInventoryData, logBooking } = require('../../shared/googleSheets.js');

// Helper to update inventory for a booking reservation.
async function reserveStock(cameraModel, lensType, quantity) {
  const inventory = await getInventoryData();
  // Find the matching inventory item.
  const item = inventory.find(i => i.cameraModel === cameraModel && i.lensType === lensType);
  if (!item) throw new Error('Inventory item not found');
  const availableStock = Number(item.quantity);
  if (quantity > availableStock) throw new Error('Insufficient stock available');
  // Update the quantity.
  item.quantity = (availableStock - quantity).toString();
  // Rebuild the entire data array to update the sheet.
  const updatedData = inventory.map(i => [i.id, i.cameraModel, i.lensType, i.quantity, i.location]);
  await updateInventoryData(updatedData);
  return item;
}

router.post('/', async (req, res) => {
  try {
    const { date, duration, cameraModel, lensType, quantity, customerEmail } = req.body;
    if (!date || !duration || !cameraModel || !lensType || !quantity || !customerEmail) {
      return res.status(400).json({ error: 'Missing booking details' });
    }
    
    // Check and reserve stock from Google Sheets.
    try {
      await reserveStock(cameraModel, lensType, Number(quantity));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    
    // Compute endDate logic (same as before)
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
    
    // Create booking object.
    const booking = {
      id: Date.now(), // or your preferred unique identifier
      date,
      duration,
      endDate,
      cameraModel,
      lensType,
      quantity,
      customerEmail,
      status: 'Confirmed'
    };

    // Log the booking in Google Sheets.
    await logBooking(booking);

    res.status(200).json({
      message: 'Booking confirmed',
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

module.exports = router;
