// src/components/BookingFormComponent.js
import React, { useState } from 'react';

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
    <div>
      <h2>Booking Form for {selectedDate}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rental Duration:</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="">Select duration</option>
            <option value="1 night">1 night (£250)</option>
            <option value="7 nights">7 nights (£600)</option>
            <option value="30 nights">30 nights (£1500)</option>
            <option value="subsequent months">Subsequent months (£1000 per month)</option>
            <option value="6-month rental">6-month rental (£6000 total)</option>
          </select>
        </div>
        <div>
          <label>Camera Model:</label>
          <input
            type="text"
            value={cameraModel}
            onChange={(e) => setCameraModel(e.target.value)}
          />
        </div>

        <div>
          <label>Lens Type:</label>

          <select
          type="checkbox"
          value={lensType}
            onChange={(e) => setLensType(e.target.value)}
          >
         <option value="29">29°</option>
         <option value="42">42°</option>
         <option value="51">51°</option>
         <option value="80">80°</option>
         <option value="95">95°</option>
       </select>

        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Your Email:</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>
        <button type="submit">Book Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BookingFormComponent;
