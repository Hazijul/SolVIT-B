import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './doc-dashboard/dashboard.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import SignupPage from './signup/signup.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { Hospital } from './components/Hospital DashBoard/Hospital.jsx';
import LoginPage from './login/login.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import NGO from './NGOs/ngo.jsx';
import Layout from './components/Layout.jsx'; // Import Layout
import SearchPage from './search/search.jsx';
import StartPage from './doc-dashboard/start/start.jsx';
import View from './search/view.jsx';
import Appointments from './appointments/appointments.jsx';
import Settings from './settings/settings.jsx';
import { Hospitallogin } from './components/Hospital DashBoard/Hospitallogin.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes using Layout */}
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<App />} />
              <Route path="help" element={<NGO />} />
              <Route path="search" element={<SearchPage/>}/>
              <Route path="view" element={<View />} />
              <Route path="appointments" element={<PrivateRoute>
                <Appointments />
              </PrivateRoute>} />
              <Route path="settings" element={<PrivateRoute>
                <Settings/></PrivateRoute>} />
            </Route>

            {/* Auth Routes without Layout */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/hospital/registration" element={<Hospital/>} />
            <Route path="/hospital/login" element={<Hospitallogin/>} />

            {/* Protected Routes without Layout */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/start"
              element={
                <PrivateRoute>
                  <StartPage />
                </PrivateRoute>
              }
            />

            {/* Optional: 404 Not Found Route */}
            <Route path="*" element={<div className="p-4 text-center">404 - Page Not Found</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
