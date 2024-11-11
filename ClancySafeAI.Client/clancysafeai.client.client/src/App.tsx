import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardScreen from '@/components/features/dashboard/DashboardScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;