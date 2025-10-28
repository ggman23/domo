import axios from 'axios'

const API_BASE_URL = '/api/tuya'

// Récupère tous les appareils d'un utilisateur
export const fetchDevices = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices/${userId}`)
    return response.data.devices || []
  } catch (error) {
    console.error('Erreur lors de la récupération des appareils:', error)
    throw new Error(error.response?.data?.message || 'Impossible de récupérer les appareils')
  }
}

// Récupère les informations d'un appareil
export const fetchDeviceInfo = async (deviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/device/${deviceId}`)
    return response.data.device
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible de récupérer l\'appareil')
  }
}

// Récupère le statut d'un appareil
export const fetchDeviceStatus = async (deviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/device/${deviceId}/status`)
    return response.data.status || []
  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error)
    throw new Error(error.response?.data?.message || 'Impossible de récupérer le statut')
  }
}

// Allume un appareil
export const turnOnDevice = async (deviceId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/device/${deviceId}/on`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de l\'allumage de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible d\'allumer l\'appareil')
  }
}

// Éteint un appareil
export const turnOffDevice = async (deviceId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/device/${deviceId}/off`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de l\'extinction de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible d\'éteindre l\'appareil')
  }
}

// Contrôle un appareil avec des commandes personnalisées
export const controlDevice = async (deviceId, commands) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/device/${deviceId}/control`, {
      commands,
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors du contrôle de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible de contrôler l\'appareil')
  }
}
