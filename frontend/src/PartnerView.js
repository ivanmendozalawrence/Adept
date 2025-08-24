import React, {useState} from 'react';
import './style.css';

const CheckSquareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11L12 14L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GreenCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#14AE5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PartnerView = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const exampleJson = `{
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "http://example.gov/credentials/3732",
    "type": ["VerifiableCredential", "BusinessLicenseCredential"],
    "issuer": "did:example:123456789",
    "issuanceDate": "2025-07-22T13:30:00Z",
    "credentialSubject": {
        "id": "did:example:partner-xyz",
        "license": {
        "type": "BusinessLicense",
        "licenseNumber": "PH-DTI-1234567"
        }
    },
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:example:123456789#keys-1",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..loremipsumdolorsitamet"
    }
    }`;

    return (
        <div className="partner-view-page">
        {/* Header */}
        <header className="partner-view-header">
            <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/39d21476ef585e1f49d63157a9686b9916d8f408?width=280" 
            alt="ADEPT Logo" 
            className="partner-view-logo"
            />
        </header>

        {/* Main Section */}
        <main className="partner-view-main">
            <div className="credential-card">
            {isSubmitted ? (
                <div className="credential-success-container">
                <div className="credential-success-message">
                    <GreenCheckIcon />
                    <div className="credential-success-text">
                    <p>Credentials received and validated for <strong>Metro Trade Logistics</strong>.</p>
                    <p>This concludes the onboarding process. Welcome to BPI!</p>
                    </div>
                </div>
                <p className="credential-success-footer-text">
                    We have sent an email confirmation of your VC submission. You can now close this window.
                </p>
                </div>
            ) : (
                <>
                <div className="credential-card-header">
                    <h1>Welcome, Metro Trade Logistics!</h1>
                    <p>This feature only simplifies the capability of ADEPT leveraging Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) submission for this hackathon setting.</p>
                </div>
                <form className="credential-form" onSubmit={handleSubmit}>
                    <label htmlFor="credentialJson" className="credential-label">Paste Verifiable Credential (JSON)</label>
                    <textarea
                    id="credentialJson"
                    className="credential-textarea"
                    defaultValue={exampleJson}
                    />
                    <button type="submit" className="submit-credential-button">
                    <CheckSquareIcon />
                    <span>Submit Credentials</span>
                    </button>
                </form>
                </>
            )}
            </div>
        </main>

        {/* Footer */}
        <footer className="partner-view-footer">
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
        </footer>
        </div>
    );
};