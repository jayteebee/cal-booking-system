// src/components/BookingFormComponent.js
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Grid2';


function BookingFormComponent({ selectedDate }) {
  const [duration, setDuration] = useState('');
  const [cameraModel, setCameraModel] = useState('');
  const [lensType, setLensType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare booking data
    const bookingData = {
      date: selectedDate,
      duration,
      cameraModel,
      lensType,
      quantity,
      customerEmail,
    };
    console.log('Booking data:', bookingData);
    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      if (response.ok) {
        setMessage('Booking confirmed: ' + JSON.stringify(result.booking));
      } else {
        setMessage('Error: ' + result.error);
      }
    } catch (error) {
      setMessage('Network error: ' + error.message);
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Booking Form for {selectedDate}
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <TextField
            select
            label="Rental Duration"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <MenuItem value="1 night">1 night (£250)</MenuItem>
            <MenuItem value="7 nights">7 nights (£600)</MenuItem>
            <MenuItem value="30 nights">30 nights (£1500)</MenuItem>
            <MenuItem value="subsequent months">Subsequent months (£1000 per month)</MenuItem>
            <MenuItem value="6-month rental">6-month rental (£6000 total)</MenuItem>
          </TextField>
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="Camera Model"
            fullWidth
            value={cameraModel}
            onChange={(e) => setCameraModel(e.target.value)}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="Lens Type"
            fullWidth
            value={lensType}
            onChange={(e) => setLensType(e.target.value)}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            label="Your Email"
            type="email"
            fullWidth
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </Grid>
        <Grid xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Book Now
          </Button>
        </Grid>
        {message && (
          <Grid xs={12}>
            <Typography variant="body1" color="secondary">
              {message}
            </Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
}

export default BookingFormComponent;
