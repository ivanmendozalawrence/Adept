import { PlaceholderPicture } from "./PlaceholderPicture";
import "./style.css";

export const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
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
            <span className="nav-link">Sign In</span>
          </div>
          <div className="nav-item">
            <span className="nav-link">About Us</span>
          </div>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main-section">
        <div className="content-wrapper">
          <div className="text-content">
            <div className="headline-container">
              <h1 className="main-headline">
                Your Trusted B2B Collaboration Platform
              </h1>
            </div>
            <p className="description">
              ADEPT (Automated Data Exchange & Predictive Trust) is a B2B Open Banking platform MVP focused on enhancing inter-company financial collaboration by automating partner trust verification and providing predictive insights into data integrity.
            </p>
            <div className="cta-container">
              <button className="cta-button">
                <span className="button-text">Proceed to Sign In</span>
              </button>
            </div>
          </div>
        </div>
        <div className="image-section">
          <PlaceholderPicture className="hero-image" />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo-container">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/aa5298cf69ee4e93a91b7792882940cb6d30a105?width=152" 
            alt="ADEPT Logo" 
            className="footer-logo"
          />
        </div>
        <div className="footer-text">
          <span>Developed by Team EcoLogic for BPI DATA Wave 2025</span>
        </div>
        <nav className="footer-nav">
          <div className="footer-nav-item">
            <span className="footer-nav-link">About Us</span>
          </div>
        </nav>
      </footer>
    </div>
  );
};
