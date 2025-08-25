import React from 'react';
import '../style.css';

export const SiteFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer global-footer" role="contentinfo">
      <div className="footer-logo-container">
        <span className="footer-text">ADEPT</span>
      </div>
      <div className="footer-text">&copy; {year} ADEPT. All rights reserved.</div>
      <nav className="footer-nav" aria-label="Footer Navigation">
        <div className="footer-nav-item"><a className="footer-nav-link" href="/about">About</a></div>
        <div className="footer-nav-item"><a className="footer-nav-link" href="/privacy">Privacy</a></div>
        <div className="footer-nav-item"><a className="footer-nav-link" href="/terms">Terms</a></div>
      </nav>
    </footer>
  );
};
