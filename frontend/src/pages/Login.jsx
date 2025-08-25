import React, { useState, useEffect } from 'react';
import { LoginLeftImage } from '../assets';
import { LoginForm } from '../components/LoginForm.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import '../style.css';
import { useNavigate, Link } from 'react-router-dom';

const GoogleIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.37592 10.568C6.16317 11.1899 6.05504 11.8427 6.05592 12.5C6.05592 13.234 6.18792 13.937 6.43192 14.586C6.73603 15.3972 7.21372 16.1321 7.83156 16.7393C8.4494 17.3466 9.19247 17.8115 10.0088 18.1015C10.8251 18.3916 11.6949 18.4998 12.5574 18.4185C13.4199 18.3372 14.2542 18.0684 15.0019 17.631H15.0029C16.181 16.9404 17.0861 15.8661 17.5669 14.588H12.2199V10.632H21.8249C22.0733 11.9405 22.0584 13.2854 21.7809 14.588C21.3001 16.8399 20.0568 18.8568 18.2609 20.298C16.4871 21.7264 14.2773 22.5035 11.9999 22.5C10.2829 22.501 8.59455 22.0597 7.09755 21.2187C5.60056 20.3778 4.34538 19.1655 3.45293 17.6986C2.56049 16.2317 2.06086 14.5597 2.00218 12.8437C1.9435 11.1276 2.32776 9.42542 3.11792 7.901C3.96089 6.27291 5.2353 4.90796 6.8018 3.9554C8.36829 3.00284 10.1665 2.49936 11.9999 2.5C14.4259 2.5 16.6509 3.364 18.3829 4.802L15.1429 7.454C14.3839 6.98164 13.5282 6.68643 12.6394 6.59034C11.7507 6.49424 10.8516 6.59972 10.0092 6.89894C9.16682 7.19816 8.40269 7.68342 7.77366 8.31864C7.14463 8.95386 6.66688 9.7227 6.37592 10.568Z" fill="#0F62FE"/>
  </svg>
);

export const Login = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
  const apiBase = process.env.REACT_APP_API_BASE;
  fetch(`${apiBase}/auth/session`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (data.authenticated) navigate('/dashboard'); })
      .catch(() => {});
  }, [navigate]);

  // Popup listener removed (now using pure redirect flow)

  const handleSubmit = (creds) => { console.log('Credentials submitted', creds); setOpenModal(false); };

  const handleGoogle = () => {
    if (authenticating) return;
    setAuthenticating(true);
    const apiBase = process.env.REACT_APP_API_BASE;
    // Direct full-page redirect (backend will default to redirect mode)
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-main">
        <div className="login-left-column">
          <div className="login-image-container">
            <img src={LoginLeftImage} alt="Login background" className="login-bg-image" />
          </div>
        </div>
        <div className="login-right-column">
          <div className="login-content">
            <div className="login-header">
              <h1 className="login-title">Sign in to your account</h1>
            </div>
            <div className="login-description">
              <p>
                To access ADEPT, please use your authorized email account.
                <br /><br />
                This prototype uses Google sign-in for demonstration.
              </p>
            </div>
            <div className="login-button-container">
              <button className="google-signin-button" onClick={handleGoogle} disabled={authenticating}>
                <GoogleIcon />
                <span className="button-text">{authenticating ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            </div>
            <div className="login-separator"></div>
            <div className="login-footer enhanced" style={{gap:'16px'}}>
              <button type="button" className="action-button" onClick={() => alert('Support coming soon')}>Need help signing in?</button>
              <Link to="/" className="action-button" style={{textDecoration:'none'}}>Return Home</Link>
            </div>
          </div>
        </div>
        <LoginForm open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />
      </div>
      <SiteFooter />
    </div>
  );
};
