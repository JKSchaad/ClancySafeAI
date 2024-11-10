import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegistrationForm } from './components/features/auth/register/RegistrationForm';
import LoginScreen from './components/features/auth/login/LoginScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;