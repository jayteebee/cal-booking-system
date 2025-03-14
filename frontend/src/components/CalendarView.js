// src/components/CalendarView.js
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarView({ events, onSelectEvent, onNavigate, onViewChange }) {
  return (
    <div style={{ height: '600px', margin: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day']}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        onView={onViewChange}
      />
    </div>
  );
}

export default CalendarView;
