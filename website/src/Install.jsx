import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Link } from 'react-router-dom'

function Install() {
  return (
    <div className="app-container">
      <div className="content">
        <div className="icon-container">
          <i className="fas fa-download"></i>
        </div>
        <h1 className="title">Installation Guide</h1>
        <p className="subtitle">How to install LazyCast on Android</p>

        <div className="info-section">
          <h2 className="section-title">Step 1: Download</h2>
          <p className="info-text">
            Download the LazyCast.apk file from the main page. The file will be saved to your device's Downloads folder.
          </p>
        </div>

        <div className="info-section">
          <h2 className="section-title">Step 2: Enable Unknown Sources</h2>
          <p className="info-text">
            Before installing, you need to allow installation from unknown sources:
          </p>
          <ul className="info-list">
            <li><i className="fas fa-check"></i> Go to Settings &gt; Security</li>
            <li><i className="fas fa-check"></i> Enable "Unknown sources" or "Install unknown apps"</li>
            <li><i className="fas fa-check"></i> Confirm the warning message</li>
          </ul>
        </div>

        <div className="info-section">
          <h2 className="section-title">Step 3: Install APK</h2>
          <p className="info-text">
            Open the downloaded APK file from your Downloads folder and tap "Install". The installation will begin automatically.
          </p>
        </div>

        <div className="info-section">
          <h2 className="section-title">Step 4: Grant Permissions</h2>
          <p className="info-text">
            During installation, you may be asked to grant permissions for location access. This is required for the app to provide weather information for your location.
          </p>
        </div>

        <div className="info-section">
          <h2 className="section-title">Step 5: Launch App</h2>
          <p className="info-text">
            After installation, tap "Open" or find LazyCast in your app drawer. The app will request location permissions on first launch.
          </p>
        </div>

        <div className="info-section">
          <h2 className="section-title">Troubleshooting</h2>
          <ul className="info-list">
            <li><i className="fas fa-exclamation-triangle"></i> If installation fails, ensure you have enough storage space</li>
            <li><i className="fas fa-exclamation-triangle"></i> Make sure "Unknown sources" is enabled in settings</li>
            <li><i className="fas fa-exclamation-triangle"></i> Try downloading the APK again if the file is corrupted</li>
          </ul>
        </div>

        <Link to="/" className="secondary-button">
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </Link>

        <div className="footer">
          <p className="version">Version 1.0.0</p>
          <p className="copyright">© 2026 LazyCast. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Install
