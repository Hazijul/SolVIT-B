import React from "react";
import "./main.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Mentorship</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>CONNECT WITH US</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/yourpage" target="_blank" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/yourhandle" target="_blank" className="social-icon"><i className="fab fa-x-twitter"></i></a>
            <a href="https://www.linkedin.com/company/yourprofile" target="_blank" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/yourprofile" target="_blank" className="social-icon"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Urban Eye. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
