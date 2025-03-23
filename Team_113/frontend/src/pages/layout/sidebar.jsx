import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu } from 'lucide-react';
import { RoutesPathName } from '../../constants';
import './sidebar.css'; // Import CSS file

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Inventory', 
      path: RoutesPathName.Inventory_page 
    },
  ];

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isSidebarOpen && <h1 className="logo">DUKAAN</h1>}
        <button onClick={toggleSidebar} className="menu-btn">
          <Menu className="icon" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="icon" />
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
