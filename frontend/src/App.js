import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingView from './components/BookingView';
import AdminDashboard from './components/AdminDashboard';

function App() {
  console.log('App.js');
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={BookingView} />
        <Route path="/admin" component={AdminDashboard} />
      </Routes>
    </Router>
  );
}

export default App;
