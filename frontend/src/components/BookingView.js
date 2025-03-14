// src/components/BookingView.js
import React, { useState, useEffect } from 'react';
import CalendarView from './CalendarView';
import BookingFormComponent from './BookingFormComponent';

function BookingView() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch bookings from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then((response) => response.json())
      .then((data) => {
        // Assuming 'data' is an array of booking objects, convert them into events.
        // For simplicity, assume each booking's event spans one day.
        const calendarEvents = data.map((booking) => {
          return {
            title: `Booking: ${booking.cameraModel}`,
            start: new Date(booking.date),
            end: new Date(booking.date),
            booking, // optionally attach the full booking details
          };
        });
        setEvents(calendarEvents);
      })
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  return (
    <div>
      <h1>Customer Booking View</h1>
      <CalendarView
        events={events}
        onSelectEvent={(event) => {
          // Optionally, you can open a modal with booking details when an event is clicked
          console.log('Event selected:', event);
        }}
        onSelectSlot={(slotInfo) => {
          // When a user selects a slot, use the start date as the selected date
          setSelectedDate(slotInfo.start.toISOString().slice(0, 10));
        }}
        onNavigate={(date) => {
          console.log('Navigated to date:', date);
        }}
        onViewChange={(view) => {
          console.log('View changed to:', view);
        }}
      />

      {/* Render the BookingForm only if a date is selected */}
      {selectedDate && <BookingFormComponent selectedDate={selectedDate} />}
    </div>
  );
}

export default BookingView;
