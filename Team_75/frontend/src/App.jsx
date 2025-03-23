import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './Pages/Auth/SignUp';
import LogIn from './Pages/Auth/LogIn';
import Dashboard from './Pages/Dashboard/Dashboard';
import OTPInput from './Pages/Auth/Sent_email';
import Hero from './Pages/Index/Hero';
import Features from './Pages/Index/Features';
import Team from './Pages/Index/Team';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/verifying" element={<OTPInput />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Hero />} />
        <Route path="/features" element={<Features />} />
        <Route path="/team" element={<Team />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes> 
    </Router>
  );
}

export default App;