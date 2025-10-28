import { useState, useEffect } from 'react'
import Header from './components/Header'
import DeviceGrid from './components/DeviceGrid'
import ConsumptionChart from './components/ConsumptionChart'
import ConfigModal from './components/ConfigModal'
import { fetchDevices, fetchDeviceStatus } from './services/api'
import './App.css'

function App() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [userId, setUserId] = useState(localStorage.getItem('tuya_user_id') || '')
  const [totalConsumption, setTotalConsumption] = useState(0)

  // Fonction pour charger les appareils
  const loadDevices = async () => {
    if (!userId) {
      setShowConfig(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const devicesData = await fetchDevices(userId)

      // Enrichir les appareils avec leur statut
      const enrichedDevices = await Promise.all(
        devicesData.map(async (device) => {
          try {
            const status = await fetchDeviceStatus(device.id)
            return {
              ...device,
              status: status,
              isOnline: device.online || false,
            }
          } catch (err) {
            console.error(`Erreur lors de la récupération du statut de ${device.name}:`, err)
            return {
              ...device,
              status: [],
              isOnline: false,
            }
          }
        })
      )

      setDevices(enrichedDevices)

      // Calculer la consommation totale
      const total = enrichedDevices.reduce((acc, device) => {
        const powerStatus = device.status?.find(s => s.code === 'cur_power')
        const power = powerStatus ? powerStatus.value / 10 : 0 // Tuya retourne en dixièmes de watt
        return acc + power
      }, 0)

      setTotalConsumption(total)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des appareils')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  // Charger les appareils au démarrage
  useEffect(() => {
    loadDevices()

    // Recharger toutes les 30 secondes
    const interval = setInterval(loadDevices, 30000)
    return () => clearInterval(interval)
  }, [userId])

  // Sauvegarder le userId quand il change
  const handleUserIdChange = (newUserId) => {
    setUserId(newUserId)
    localStorage.setItem('tuya_user_id', newUserId)
    setShowConfig(false)
    loadDevices()
  }

  return (
    <div className="app">
      <Header
        totalDevices={devices.length}
        activeDevices={devices.filter(d => d.isOnline).length}
        totalConsumption={totalConsumption}
        onConfig={() => setShowConfig(true)}
        onRefresh={loadDevices}
      />

      <main className="main-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos appareils...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">
              <h2>Erreur de connexion</h2>
              <p>{error}</p>
              <button onClick={() => setShowConfig(true)} className="btn-primary">
                Configurer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && devices.length === 0 && (
          <div className="empty-container">
            <h2>Aucun appareil trouvé</h2>
            <p>Vérifiez votre configuration Tuya</p>
            <button onClick={() => setShowConfig(true)} className="btn-primary">
              Configurer
            </button>
          </div>
        )}

        {!loading && !error && devices.length > 0 && (
          <>
            <DeviceGrid devices={devices} onDeviceUpdate={loadDevices} />

            <section className="charts-section">
              <h2>Consommation en temps réel</h2>
              <ConsumptionChart devices={devices} />
            </section>
          </>
        )}
      </main>

      {showConfig && (
        <ConfigModal
          userId={userId}
          onSave={handleUserIdChange}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}

export default App
