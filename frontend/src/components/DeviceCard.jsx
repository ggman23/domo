import { useState } from 'react'
import {
  Power,
  Tv,
  Lightbulb,
  Plug,
  Monitor,
  Zap,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { turnOnDevice, turnOffDevice } from '../services/api'
import './DeviceCard.css'

// Icônes selon le type d'appareil
const DEVICE_ICONS = {
  tv: Tv,
  television: Tv,
  light: Lightbulb,
  lumiere: Lightbulb,
  ampoule: Lightbulb,
  plug: Plug,
  prise: Plug,
  computer: Monitor,
  ordinateur: Monitor,
  pc: Monitor,
  shield: Monitor,
  nvidia: Monitor,
}

function DeviceCard({ device, onUpdate }) {
  const [loading, setLoading] = useState(false)

  // Déterminer si l'appareil est allumé
  const switchStatus = device.status?.find(s => s.code === 'switch_1' || s.code === 'switch')
  const isOn = switchStatus?.value || false

  // Récupérer la consommation
  const powerStatus = device.status?.find(s => s.code === 'cur_power')
  const power = powerStatus ? (powerStatus.value / 10).toFixed(1) : '0.0' // Tuya retourne en dixièmes de watt

  // Récupérer la tension
  const voltageStatus = device.status?.find(s => s.code === 'cur_voltage')
  const voltage = voltageStatus ? (voltageStatus.value / 10).toFixed(0) : '0'

  // Récupérer le courant
  const currentStatus = device.status?.find(s => s.code === 'cur_current')
  const current = currentStatus ? (currentStatus.value / 1000).toFixed(2) : '0.00'

  // Déterminer l'icône selon le nom de l'appareil
  const getDeviceIcon = () => {
    const deviceName = device.name.toLowerCase()
    for (const [key, Icon] of Object.entries(DEVICE_ICONS)) {
      if (deviceName.includes(key)) {
        return Icon
      }
    }
    return Plug // Icône par défaut
  }

  const DeviceIcon = getDeviceIcon()

  // Gérer le basculement on/off
  const handleToggle = async () => {
    setLoading(true)
    try {
      if (isOn) {
        await turnOffDevice(device.id)
      } else {
        await turnOnDevice(device.id)
      }
      // Attendre un peu puis actualiser
      setTimeout(() => {
        onUpdate()
      }, 1000)
    } catch (error) {
      console.error('❌ Erreur contrôle appareil:', {
        device: device.name,
        deviceId: device.id,
        action: isOn ? 'off' : 'on',
        error: error.response?.data || error.message
      })

      const errorDetails = error.response?.data?.details
      const errorMsg = errorDetails?.error || error.response?.data?.message || error.message
      const errorCode = errorDetails?.code || error.response?.data?.code

      alert(`❌ Erreur: ${errorMsg}${errorCode ? `\nCode: ${errorCode}` : ''}\n\nAppareil: ${device.name}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`device-card ${isOn ? 'active' : ''} ${loading ? 'loading' : ''}`}>
      {/* En-tête */}
      <div className="device-header">
        <div className={`device-icon ${isOn ? 'on' : 'off'}`}>
          <DeviceIcon size={28} />
        </div>
        <div className="device-status">
          {device.isOnline ? (
            <Wifi size={16} className="status-online" />
          ) : (
            <WifiOff size={16} className="status-offline" />
          )}
        </div>
      </div>

      {/* Nom */}
      <h3 className="device-name">{device.name}</h3>
      <p className="device-type">{device.category || 'Appareil'}</p>

      {/* Consommation */}
      <div className="device-consumption">
        <div className="consumption-main">
          <Zap size={20} />
          <span className="consumption-value">{power} W</span>
        </div>
        {parseFloat(power) > 0 && (
          <div className="consumption-details">
            <div className="consumption-detail">
              <span className="detail-label">Tension</span>
              <span className="detail-value">{voltage} V</span>
            </div>
            <div className="consumption-detail">
              <span className="detail-label">Courant</span>
              <span className="detail-value">{current} A</span>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="device-controls">
        <button
          className={`toggle-btn ${isOn ? 'on' : 'off'}`}
          onClick={handleToggle}
          disabled={loading || !device.isOnline}
        >
          <Power size={20} />
          <span>{loading ? 'Chargement...' : isOn ? 'Éteindre' : 'Allumer'}</span>
        </button>
      </div>

      {/* Commande Google Assistant */}
      {device.name && (
        <div className="google-command">
          <p className="command-label">Commande Google:</p>
          <code className="command-text">
            "Ok Google, {isOn ? 'éteins' : 'allume'} {device.name}"
          </code>
        </div>
      )}
    </div>
  )
}

export default DeviceCard
