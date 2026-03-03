// Footer.jsx
import React from 'react';
import '../styles/CustomerHomePage.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>ShopArea</h3>
          <p>Your one-stop shop for all your needs</p>
        </div>

        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ShopArea. All rights reserved.</p>
      </div>
    </footer>
  );
}