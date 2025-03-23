import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { CategorySelection } from './components/CategorySelection';
import { RetailPage } from './components/RetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { useUserStore } from './lib/store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CategorySelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/retail/*"
          element={
            <ProtectedRoute>
              <RetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;