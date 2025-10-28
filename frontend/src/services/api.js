import axios from 'axios'

// Détecter si on est en production (Vercel) ou en développement local
const API_BASE_URL = '/api'

// Récupère automatiquement le User ID
export const fetchUserId = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/userid`)
    return response.data.userId
  } catch (error) {
    console.error('Erreur lors de la récupération du User ID:', error)
    throw new Error(error.response?.data?.message || 'Impossible de récupérer le User ID')
  }
}

// Récupère tous les appareils d'un utilisateur
export const fetchDevices = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices`, {
      params: { userId }
    })
    return response.data.devices || []
  } catch (error) {
    console.error('Erreur lors de la récupération des appareils:', error)
    throw new Error(error.response?.data?.message || 'Impossible de récupérer les appareils')
  }
}

// Récupère le statut d'un appareil
export const fetchDeviceStatus = async (deviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`, {
      params: { deviceId }
    })
    return response.data.status || []
  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error)
    throw new Error(error.response?.data?.message || 'Impossible de récupérer le statut')
  }
}

// Allume un appareil
export const turnOnDevice = async (deviceId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/control?deviceId=${deviceId}&action=on`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de l\'allumage de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible d\'allumer l\'appareil')
  }
}

// Éteint un appareil
export const turnOffDevice = async (deviceId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/control?deviceId=${deviceId}&action=off`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de l\'extinction de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible d\'éteindre l\'appareil')
  }
}

// Contrôle un appareil avec des commandes personnalisées
export const controlDevice = async (deviceId, commands) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/control?deviceId=${deviceId}`, {
      commands,
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors du contrôle de l\'appareil:', error)
    throw new Error(error.response?.data?.message || 'Impossible de contrôler l\'appareil')
  }
}
