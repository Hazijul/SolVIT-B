// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar'; // Ensure Navbar is correctly imported

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Main Content */}
      <div className="pt-0"> {/* Adjust padding to match Navbar height */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;