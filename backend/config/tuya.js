import crypto from 'crypto';
import axios from 'axios';

const TUYA_CONFIG = {
  clientId: process.env.TUYA_CLIENT_ID,
  clientSecret: process.env.TUYA_CLIENT_SECRET,
  region: process.env.TUYA_REGION || 'eu',
};

// URLs de l'API Tuya selon la région
const TUYA_ENDPOINTS = {
  eu: 'https://openapi.tuyaeu.com',
  us: 'https://openapi.tuyaus.com',
  cn: 'https://openapi.tuyacn.com',
  in: 'https://openapi.tuyain.com',
};

class TuyaAPI {
  constructor() {
    this.baseUrl = TUYA_ENDPOINTS[TUYA_CONFIG.region];
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Génère la signature pour l'authentification Tuya
  generateSignature(method, path, params = {}, body = '') {
    const timestamp = Date.now().toString();
    const clientId = TUYA_CONFIG.clientId;
    const secret = TUYA_CONFIG.clientSecret;
    const token = this.accessToken || '';

    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const contentHash = crypto
      .createHash('sha256')
      .update(body)
      .digest('hex');

    const stringToSign = [
      method,
      contentHash,
      '',
      path + (sortedParams ? `?${sortedParams}` : ''),
    ].join('\n');

    const signStr = clientId + token + timestamp + stringToSign;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signStr)
      .digest('hex')
      .toUpperCase();

    return {
      timestamp,
      signature,
      clientId,
      token,
    };
  }

  // Récupère le token d'accès
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const path = '/v1.0/token?grant_type=1';
    const method = 'GET';
    const signData = this.generateSignature(method, path.split('?')[0], { grant_type: '1' });

    try {
      const response = await axios({
        method,
        url: this.baseUrl + path,
        headers: {
          client_id: signData.clientId,
          sign: signData.signature,
          t: signData.timestamp,
          sign_method: 'HMAC-SHA256',
        },
      });

      if (response.data.success) {
        this.accessToken = response.data.result.access_token;
        this.tokenExpiry = Date.now() + (response.data.result.expire_time * 1000);
        console.log('✅ Token Tuya obtenu avec succès');
        return this.accessToken;
      } else {
        throw new Error(response.data.msg || 'Échec de l\'authentification Tuya');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'obtention du token:', error.message);
      throw error;
    }
  }

  // Effectue une requête API Tuya
  async request(method, path, body = null) {
    await this.getAccessToken();

    const bodyStr = body ? JSON.stringify(body) : '';
    const signData = this.generateSignature(method, path, {}, bodyStr);

    try {
      const response = await axios({
        method,
        url: this.baseUrl + path,
        headers: {
          client_id: signData.clientId,
          sign: signData.signature,
          t: signData.timestamp,
          sign_method: 'HMAC-SHA256',
          access_token: this.accessToken,
          'Content-Type': 'application/json',
        },
        data: body,
      });

      if (response.data.success) {
        return response.data.result;
      } else {
        throw new Error(response.data.msg || 'Erreur API Tuya');
      }
    } catch (error) {
      console.error(`❌ Erreur API Tuya (${method} ${path}):`, error.message);
      throw error;
    }
  }

  // Récupère tous les appareils de l'utilisateur
  async getDevices(userId) {
    try {
      const devices = await this.request('GET', `/v1.0/users/${userId}/devices`);
      return devices;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des appareils:', error.message);
      throw error;
    }
  }

  // Récupère les informations d'un appareil spécifique
  async getDeviceInfo(deviceId) {
    try {
      const device = await this.request('GET', `/v1.0/devices/${deviceId}`);
      return device;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération de l'appareil ${deviceId}:`, error.message);
      throw error;
    }
  }

  // Récupère le statut d'un appareil
  async getDeviceStatus(deviceId) {
    try {
      const status = await this.request('GET', `/v1.0/devices/${deviceId}/status`);
      return status;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération du statut de ${deviceId}:`, error.message);
      throw error;
    }
  }

  // Contrôle un appareil
  async controlDevice(deviceId, commands) {
    try {
      const result = await this.request('POST', `/v1.0/devices/${deviceId}/commands`, {
        commands: commands,
      });
      return result;
    } catch (error) {
      console.error(`❌ Erreur lors du contrôle de l'appareil ${deviceId}:`, error.message);
      throw error;
    }
  }

  // Allume un appareil
  async turnOn(deviceId) {
    return this.controlDevice(deviceId, [{ code: 'switch_1', value: true }]);
  }

  // Éteint un appareil
  async turnOff(deviceId) {
    return this.controlDevice(deviceId, [{ code: 'switch_1', value: false }]);
  }
}

export default new TuyaAPI();
