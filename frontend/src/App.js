import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingView from './components/BookingView';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingView />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
