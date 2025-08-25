import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaceholderPicture } from '../components/PlaceholderPicture';
import { AboutUsModal } from '../components/AboutUsModal.jsx';
import '../style.css';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  useEffect(() => {
    const apiBase = process.env.REACT_APP_API_BASE;
    fetch(`${apiBase}/auth/session`, { credentials: 'include' })
      .then(r => r.json())
  .then(d => { if (d.authenticated) navigate('/dashboard'); })
      .catch(()=>{});
  }, [navigate]);
  const goLogin = () => navigate('/login');
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo-container">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/39d21476ef585e1f49d63157a9686b9916d8f408?width=280"
            alt="ADEPT Logo"
            className="header-logo"
          />
        </div>
        <nav className="header-nav">
          <div className="nav-item">
            <button className="nav-link nav-button" onClick={goLogin}>Sign In</button>
          </div>
          <div className="nav-item">
            <button className="nav-link nav-button no-wrap" onClick={() => setAboutOpen(true)}>About Us</button>
          </div>
        </nav>
      </header>

      <main className="main-section">
        <div className="content-wrapper">
          <div className="text-content">
            <div className="headline-container">
              <h1 className="main-headline">Your Trusted B2B Collaboration Platform</h1>
            </div>
            <p className="description">
              ADEPT (Automated Data Exchange & Predictive Trust) is a B2B Open Banking platform MVP focused on enhancing inter-company financial collaboration by automating partner trust verification and providing predictive insights into data integrity.
            </p>
            <div className="cta-container">
              <button className="cta-button" onClick={goLogin}><span className="button-text">Proceed to Sign In</span></button>
            </div>
          </div>
        </div>
        <div className="image-section">
          <PlaceholderPicture className="hero-image" />
        </div>
      </main>

      <footer className="footer">
        <div className="footer-logo-container">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/aa5298cf69ee4e93a91b7792882940cb6d30a105?width=152"
            alt="ADEPT Logo"
            className="footer-logo"
          />
        </div>
        <div className="footer-text"><span>Developed by Team EcoLogic for BPI DATA Wave 2025</span></div>
        <nav className="footer-nav">
      <div className="footer-nav-item"><button className="footer-nav-link nav-button no-wrap" onClick={() => setAboutOpen(true)}>About Us</button></div>
        </nav>
      </footer>
    <AboutUsModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
};
