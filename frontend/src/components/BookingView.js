// src/components/BookingView.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import CalendarView from './CalendarView';
import BookingFormComponent from './BookingFormComponent';

function BookingView() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [rawBookings, setRawBookings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Fetch bookings from the backend
  useEffect(() => {
    fetch('http://localhost:5001/api/bookings')
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of bookings
        setRawBookings(data);
      })
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  // When rawBookings change, aggregate and update calendar events
  useEffect(() => {
    const aggregation = aggregateBookingsByDay(rawBookings);
    const events = [];
    for (const date in aggregation) {
      const cameraEntries = aggregation[date];
      const titleParts = [];
      for (const cameraKey in cameraEntries) {
        titleParts.push(`${cameraEntries[cameraKey]} x ${cameraKey}`);
      }
      events.push({
        title: titleParts.join(', '),
        start: new Date(date),
        end: new Date(date)
      });
    }
    setCalendarEvents(events);
  }, [rawBookings]);

// Helper function to aggregate bookings by day
function aggregateBookingsByDay(bookings) {
    const aggregation = {}; // Key: date string -> { "A70-95": quantity, ... }
    
    bookings.forEach((booking) => {
      // Convert start and end dates to Date objects
      const start = new Date(booking.date);
      const end = new Date(booking.endDate);
      
      // Loop through each day in the booking range (inclusive)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        if (!aggregation[dateStr]) {
          aggregation[dateStr] = {};
        }
        // Use a combined key for camera model and lens type
        const cameraKey = `${booking.cameraModel}-${booking.lensType}`;
        if (!aggregation[dateStr][cameraKey]) {
          aggregation[dateStr][cameraKey] = 0;
        }
        aggregation[dateStr][cameraKey] += booking.quantity;
      }
    });
    
    return aggregation;
  }
  
  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Customer Booking View
      </Typography>
      <Grid container spacing={4}>
        <Grid xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <CalendarView
              events={calendarEvents}
              onSelectEvent={(event) => console.log('Event selected:', event)}
              onSelectSlot={(slotInfo) => {
                setSelectedDate(slotInfo.start.toISOString().slice(0, 10));
              }}
            />
          </Paper>
        </Grid>
        {selectedDate && (
          <Grid xs={12}>
            <Box sx={{ marginTop: 2 }}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <BookingFormComponent selectedDate={selectedDate} />
              </Paper>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default BookingView;
