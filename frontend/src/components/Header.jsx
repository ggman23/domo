import { Settings, RefreshCw, Zap, Activity } from 'lucide-react'
import './Header.css'

function Header({ totalDevices, activeDevices, totalConsumption, onConfig, onRefresh }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <Zap size={32} />
          <h1>Ma Domotique</h1>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Appareils actifs</span>
              <span className="stat-value">
                {activeDevices} / {totalDevices}
              </span>
            </div>
          </div>

          <div className="stat-card consumption">
            <div className="stat-icon">
              <Zap size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Consommation totale</span>
              <span className="stat-value">
                {totalConsumption.toFixed(0)} W
              </span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="header-btn"
            onClick={onRefresh}
            title="Actualiser"
          >
            <RefreshCw size={20} />
          </button>
          <button
            className="header-btn"
            onClick={onConfig}
            title="Configuration"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
