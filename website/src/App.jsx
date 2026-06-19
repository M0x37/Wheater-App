import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="app-container">
      <div className="content">
        <div className="icon-container">
          <i className="fas fa-cloud-sun"></i>
        </div>
        <h1 className="title">LazyCast</h1>
        <p className="subtitle">Minimalist Weather Application</p>

        <div className="info-section">
          <h2 className="section-title">About</h2>
          <p className="info-text">
            LazyCast provides accurate weather information with a clean, minimalist interface. 
            Get current conditions, hourly forecasts, and 7-day predictions for any location worldwide.
          </p>
        </div>

        <div className="info-section">
          <h2 className="section-title">Features</h2>
          <ul className="info-list">
            <li><i className="fas fa-check"></i> Current weather conditions</li>
            <li><i className="fas fa-check"></i> Hourly temperature forecast</li>
            <li><i className="fas fa-check"></i> 7-day weather prediction</li>
            <li><i className="fas fa-check"></i> Location-based services</li>
            <li><i className="fas fa-check"></i> Offline caching support</li>
            <li><i className="fas fa-check"></i> Dark mode interface</li>
          </ul>
        </div>

        <div className="button-container">
          <a 
            href="/LazyCast.apk" 
            className="download-button"
            download
          >
            <i className="fas fa-download"></i>
            Download APK
          </a>

          <Link to="/install" className="secondary-button">
            <i className="fas fa-question-circle"></i>
            Installation Guide
          </Link>
        </div>

        <div className="footer">
          <p className="version">Version 1.0.0</p>
          <p className="copyright">© 2026 LazyCast. All rights reserved.</p>
        </div>
        
        {showBanner && (
          <div className="info-banner">
            <i className="fas fa-info-circle"></i>
            <span>I know the APK install way is not the best way 
                       but it's<br/> the only way I found to distribute the app for now.</span>
            <button 
              className="close-banner" 
              onClick={() => setShowBanner(false)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
