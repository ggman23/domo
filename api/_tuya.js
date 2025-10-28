import crypto from 'crypto';
import axios from 'axios';

const TUYA_ENDPOINTS = {
  eu: 'https://openapi.tuyaeu.com',
  us: 'https://openapi.tuyaus.com',
  cn: 'https://openapi.tuyacn.com',
  in: 'https://openapi.tuyain.com',
};

class TuyaAPI {
  constructor() {
    // Lire les variables d'environnement à l'exécution, pas au chargement du module
    this.clientId = process.env.TUYA_CLIENT_ID;
    this.clientSecret = process.env.TUYA_CLIENT_SECRET;
    this.region = process.env.TUYA_REGION || 'eu';

    // Vérifier que les variables sont bien définies
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Variables d\'environnement TUYA_CLIENT_ID et TUYA_CLIENT_SECRET requises');
    }

    this.baseUrl = TUYA_ENDPOINTS[this.region];
    this.accessToken = null;
    this.tokenExpiry = null;

    console.log('TuyaAPI initialisé avec:', {
      clientId: this.clientId ? `${this.clientId.substring(0, 5)}...` : 'MANQUANT',
      clientSecret: this.clientSecret ? '***' : 'MANQUANT',
      region: this.region,
      baseUrl: this.baseUrl
    });
  }

  generateSignature(method, path, params = {}, body = '') {
    const timestamp = Date.now().toString();
    const clientId = this.clientId;
    const secret = this.clientSecret;
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
        return this.accessToken;
      } else {
        throw new Error(response.data.msg || 'Échec de l\'authentification Tuya');
      }
    } catch (error) {
      throw error;
    }
  }

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
      throw error;
    }
  }
}

// Instance partagée
let tuyaInstance = null;

function getTuyaAPI() {
  if (!tuyaInstance) {
    tuyaInstance = new TuyaAPI();
  }
  return tuyaInstance;
}

export default getTuyaAPI;
