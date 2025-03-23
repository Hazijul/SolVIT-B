import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';
import './mainlayout.css'; // Import the CSS file

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div 
        className="content"
        style={{ marginLeft: isSidebarOpen ? '256px' : '80px' }} // Equivalent to ml-64 & ml-20
      >
        <Header />
        
        {/* Router Outlet */}
        <main className="main-content">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
