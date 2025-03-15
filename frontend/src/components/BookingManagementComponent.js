// src/components/BookingManagementComponent.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

function BookingManagementComponent() {
  const [bookings, setBookings] = useState([]);
  console.log("bookings: ",bookings);
  const [openRearrangeDialog, setOpenRearrangeDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newDuration, setNewDuration] = useState('');

  // Fetch bookings from backend
  const fetchBookings = () => {
    fetch('http://localhost:5001/api/bookings')
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error('Error fetching bookings:', err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle cancellation of a booking
  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      fetch(`http://localhost:5001/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
      })
        .then((res) => res.json())
        .then(() => fetchBookings())
        .catch((err) => console.error('Error cancelling booking:', err));
    }
  };

  // Open rearrangement dialog
  const handleOpenRearrange = (booking) => {
    setCurrentBooking(booking);
    setNewDate('');
    setNewDuration('');
    setOpenRearrangeDialog(true);
  };

  const handleCloseRearrange = () => {
    setOpenRearrangeDialog(false);
    setCurrentBooking(null);
  };

  // Handle rearrangement submission
  const handleRearrange = () => {
    if (!newDate || !newDuration) {
      alert('Please enter both new date and duration.');
      return;
    }
    fetch(`http://localhost:5001/api/bookings/${currentBooking.id}/rearrange`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate, newDuration }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBookings();
        handleCloseRearrange();
      })
      .catch((err) => console.error('Error rearranging booking:', err));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Booking Management</Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Camera Model</TableCell>
              <TableCell>Lens Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell>{booking.duration}</TableCell>
                <TableCell>{booking.cameraModel}</TableCell>
                <TableCell>{booking.lensType}</TableCell>
                <TableCell>{booking.quantity}</TableCell>
                <TableCell>{booking.customerEmail}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleCancel(booking.id)}>
                    <CancelIcon color="error" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenRearrange(booking)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rearrangement Dialog */}
      <Dialog open={openRearrangeDialog} onClose={handleCloseRearrange}>
        <DialogTitle>Rearrange Booking</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="New Date (YYYY-MM-DD)"
            fullWidth
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Duration"
            fullWidth
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRearrange}>Cancel</Button>
          <Button onClick={handleRearrange} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookingManagementComponent;
