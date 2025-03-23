import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div className="brand">
        <img src="/images/Urban-Eyes-logo-SQ.png" alt="Urban Eye Logo" className="nav-logo" />
        <h1>Urban Eye</h1>
      </div>
      <div className="auth-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
