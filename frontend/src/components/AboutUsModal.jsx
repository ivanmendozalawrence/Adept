import React, { useEffect, useCallback } from 'react';
import { JanVincentPhoto, IvanLawrencePhoto } from '../assets';
import '../style.css';

export const AboutUsModal = ({ open, onClose }) => {
  const escHandler = useCallback((e) => { if (e.key === 'Escape') onClose?.(); }, [onClose]);
  useEffect(() => {
    if (!open) return; 
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [open, escHandler]);

  if (!open) return null;

  return (
    <div className="about-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="about-modal" role="dialog" aria-modal="true" aria-labelledby="aboutModalTitle">
        <button className="about-modal-close" aria-label="Close About Us" onClick={onClose}>×</button>
        <div className="about-modal-header">
          <div className="section-caption">TEAM ECOLOGIC</div>
          <h2 id="aboutModalTitle" className="section-title about-modal-title">Meet The Creators Of ADEPT.</h2>
        </div>
        <div className="about-modal-team">
          <div className="team-member">
            <div className="team-member-image">
              <img src={JanVincentPhoto} alt="Jan Vincent Elleazar - UI/UX Designer and AI Developer" className="member-photo" />
            </div>
            <div className="member-info">
              <h3 className="member-name">Jan Vincent Elleazar</h3>
              <p className="member-role">UI/UX Designer. AI Developer</p>
            </div>
          </div>
          <div className="team-member">
            <div className="team-member-image">
              <img src={IvanLawrencePhoto} alt="Ivan Lawrence Mendoza - Back-end Developer and Database Manager" className="member-photo" />
            </div>
            <div className="member-info">
              <h3 className="member-name">Ivan Lawrence Mendoza</h3>
              <p className="member-role">Back-end Developer, Database Manager</p>
            </div>
          </div>
        </div>
        <div className="about-modal-footer-note">Developed by Team EcoLogic for BPI DATA Wave 2025</div>
      </div>
    </div>
  );
};
