// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [view, setView] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch inventory data
  const fetchInventory = () => {
    fetch('http://localhost:5001/api/inventory')
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error(err));
  };

  // Fetch bookings data
  const fetchBookings = () => {
    fetch('http://localhost:5001/api/bookings')
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  };

  // Fetch audit logs data
  const fetchAuditLogs = () => {
    fetch('http://localhost:5001/api/audit')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (view === 'inventory') {
      fetchInventory();
    } else if (view === 'bookings') {
      fetchBookings();
    } else if (view === 'audit') {
      fetchAuditLogs();
    }
  }, [view]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('inventory')}>Inventory</button>
        <button onClick={() => setView('bookings')}>Bookings</button>
        <button onClick={() => setView('audit')}>Audit Logs</button>
      </div>
      
      {view === 'inventory' && (
        <div>
          <h2>Inventory Management</h2>
          <pre>{JSON.stringify(inventory, null, 2)}</pre>
          {/* Future: Add forms and controls for adding/editing/deleting inventory items */}
        </div>
      )}
      
      {view === 'bookings' && (
        <div>
          <h2>Booking Management</h2>
          <pre>{JSON.stringify(bookings, null, 2)}</pre>
          {/* Future: Add controls to cancel/rearrange bookings */}
        </div>
      )}
      
      {view === 'audit' && (
        <div>
          <h2>Audit Logs</h2>
          <pre>{JSON.stringify(auditLogs, null, 2)}</pre>
          {/* Future: Display detailed audit logs */}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
