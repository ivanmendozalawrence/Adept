import React, { useState, useEffect, useCallback } from 'react';

// Simple credential login form (no auth integration yet)
export const LoginForm = ({ open, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setError(null);
  };

  const handleClose = useCallback(() => {
    reset();
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && open) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Placeholder submit callback
    onSubmit?.({ email, password });
  };

  return (
    <div className="login-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginModalTitle">
        <button className="login-modal-close" aria-label="Close" onClick={handleClose}>×</button>
        <h2 id="loginModalTitle" className="login-modal-title">Sign In</h2>
        <form className="login-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>
          <div className="form-row">
            <label htmlFor="loginPassword">Password</label>
            <div className="password-wrapper">
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="login-modal-actions">
            <button type="submit" className="login-submit-btn">Continue</button>
            <button type="button" className="login-cancel-btn" onClick={handleClose}>Cancel</button>
          </div>
        </form>
        <div className="login-modal-footer-hint">(Session management & real auth to be added later.)</div>
      </div>
    </div>
  );
};
