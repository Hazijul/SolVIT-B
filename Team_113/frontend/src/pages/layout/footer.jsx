import React from 'react';
import './footer.css'; // Import the CSS file

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} DUKAAN. All rights reserved.</p>
    </footer>
  );
}
